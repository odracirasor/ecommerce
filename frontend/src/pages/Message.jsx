import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

const Message = () => {
  const { id: receiverId } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !receiverId) return;

    const roomId = [currentUser._id, receiverId].sort().join("_");
    socket.emit("join_room", roomId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ from }) => {
      if (from === receiverId) {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    });

    const fetchReceiver = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        const res = await fetch(`http://localhost:5000/api/users/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.username) setReceiverName(data.username);
      } catch (err) {
        console.error("Erro ao buscar nome:", err.message);
      }
    };

    const fetchMessages = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        const res = await fetch(`http://localhost:5000/api/messages/conversation/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          if (data.error === "Token inválido ou expirado.") {
            logout();
            navigate("/login");
            return;
          }
          throw new Error(data.error || "Erro desconhecido");
        }

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          throw new Error("Resposta inesperada do servidor.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReceiver();
    fetchMessages();

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.emit("leave_room", roomId);
    };
  }, [currentUser, receiverId, logout, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    const roomId = [currentUser._id, receiverId].sort().join("_");
    socket.emit("typing", {
      to: receiverId,
      from: currentUser._id,
      roomId,
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      sender: currentUser._id,
      recipient: receiverId,
      content: newMessage,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    socket.emit("send_message", tempMessage);

    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: receiverId,
          content: newMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao enviar mensagem.");
      }
    } catch (err) {
      setError("Erro de rede ao enviar mensagem.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 h-[85vh] flex flex-col bg-white border rounded shadow-lg">
      <div className="px-4 py-3 border-b bg-blue-100">
        <h2 className="text-lg font-semibold">
          Conversa com <span className="text-blue-700">{receiverName || `usuário ${receiverId}`}</span>
        </h2>
        {typing && (
          <div className="text-sm text-gray-600 italic mt-1">
            {receiverName || "Usuário"} está digitando...
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender === currentUser._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] shadow-sm ${
                  msg.sender === currentUser._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">Nenhuma mensagem encontrada.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 text-center py-2">{error}</div>
      )}

      <div className="p-3 border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Message;

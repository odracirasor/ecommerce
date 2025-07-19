import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Message = () => {
  const { sellerId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Simula busca de mensagens anteriores
  useEffect(() => {
    // Substitua isso por uma chamada real à API futuramente
    const fetchMessages = async () => {
      const fakeMessages = [
        { from: "seller", content: "Olá, como posso ajudar?" },
        { from: "user", content: "Tenho dúvidas sobre o produto." },
      ];
      setMessages(fakeMessages);
    };

    fetchMessages();
  }, [sellerId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      from: "user",
      content: newMessage,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // Aqui você deve fazer um POST para a API para salvar a mensagem
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Conversa com Vendedor {sellerId}</h2>
      <div className="h-64 overflow-y-auto border p-3 bg-gray-50 rounded mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.from === "user" ? "bg-blue-100 text-right ml-10" : "bg-green-100 text-left mr-10"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          className="flex-1 border px-3 py-2 rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Message;


import { useEffect, useState, useRef } from "react";

export default function MessagesPage() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const token = localStorage.getItem("token");
        const [inboxRes, sentRes] = await Promise.all([
          fetch("/api/messages/inbox", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/messages/sent", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const inboxData = await inboxRes.json();
        const sentData = await sentRes.json();
        setInbox(inboxData.messages || []);
        setSent(sentData.messages || []);
      } catch (error) {
        console.error("Erro ao carregar mensagens", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function openChat(userId) {
    setSelectedUser(userId);
    const conversation = [
      ...inbox.filter(m => m.sender?._id === userId),
      ...sent.filter(m => m.receiver?._id === userId),
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setMessages(conversation);
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver: selectedUser, content: newMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem", error);
    }
  }

  if (loading) return <p className="p-6">Carregando mensagens...</p>;

  // Lista única de usuários
  const uniqueUsers = [
    ...new Map(
      [...inbox.map(m => m.sender), ...sent.map(m => m.receiver)]
        .filter(Boolean)
        .map(u => [u._id, u])
    ).values()
  ];

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
        <h3 className="p-4 text-xl font-bold border-b">Conversas</h3>
        {uniqueUsers.map(user => (
          <div
            key={user._id}
            className={`p-4 cursor-pointer hover:bg-gray-100 transition ${
              selectedUser === user._id ? "bg-blue-50 font-semibold" : ""
            }`}
            onClick={() => openChat(user._id)}
          >
            {user.name || user.email}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                    msg.sender?._id === selectedUser
                      ? "bg-white self-start border"
                      : "bg-blue-600 text-white self-end"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="block text-xs mt-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t flex p-4 space-x-2 bg-white">
              <input
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Selecione um usuário para conversar
          </div>
        )}
      </div>
    </div>
  );
}

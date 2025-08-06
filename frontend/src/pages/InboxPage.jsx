import { useEffect, useState } from "react";
import { Mail, MailOpen } from "lucide-react";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchInbox() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/messages/inbox`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao carregar inbox");

        setMessages(data.messages || []);
      } catch (err) {
        console.error("Fetch inbox error:", err);
        setError(err.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInbox();
  }, [API_URL]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Carregando mensagens...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!messages.length) return <p className="text-center text-gray-400 mt-10">📭 Inbox vazia</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Mail className="w-7 h-7 text-blue-500" /> Caixa de Entrada
      </h1>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-4 rounded-xl border transition hover:shadow-md cursor-pointer ${
              msg.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">
                  <b>De:</b>{" "}
                  {msg.sender
                    ? `${msg.sender.name || "Sem nome"} (${msg.sender.email})`
                    : "Remetente desconhecido"}
                </p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{msg.subject || "(Sem assunto)"}</p>
                <p className="text-gray-700 mt-1">{msg.content || msg.text || "(Sem conteúdo)"}</p>
              </div>
              {msg.read ? (
                <MailOpen className="w-6 h-6 text-gray-400" />
              ) : (
                <Mail className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(msg.createdAt).toLocaleString("pt-PT")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

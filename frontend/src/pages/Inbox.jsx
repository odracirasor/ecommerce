import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Inbox = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchInbox = async () => {
      const token = localStorage.getItem("token");
      console.log("🔐 Token atual:", token);
      console.log("👤 Usuário atual:", currentUser);

      if (!token) {
        console.warn("⚠️ Nenhum token encontrado no localStorage.");
        setErrorMsg("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/messages/inbox", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📡 Status da resposta:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`❌ Erro HTTP ${res.status}:`, errorText);

          if (res.status === 403 && errorText.toLowerCase().includes("expired")) {
            setErrorMsg("Sua sessão expirou. Faça login novamente.");
          } else {
            setErrorMsg(`Erro ao carregar inbox: ${errorText}`);
          }

          setUsers([]);
          return;
        }

        const data = await res.json();
        console.log("📥 Dados recebidos:", data);

        if (!Array.isArray(data)) {
          console.warn("⚠️ Resposta inesperada, esperado um array.");
          setUsers([]);
          return;
        }

        const uniqueSenders = [];
        const seen = new Set();

        data.forEach((msg) => {
          if (msg.sender && !seen.has(msg.sender._id)) {
            seen.add(msg.sender._id);
            uniqueSenders.push(msg.sender);
          }
        });

        setUsers(uniqueSenders);
      } catch (err) {
        console.error("❌ Erro na requisição:", err.message);
        setErrorMsg("Erro ao carregar mensagens.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [currentUser]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📬 Caixa de Entrada</h2>

      {loading ? (
        <p className="text-gray-500">Carregando mensagens...</p>
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">Nenhuma conversa encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((sender) => (
            <li
              key={sender._id}
              className="border p-3 rounded hover:bg-gray-100 transition"
            >
              <Link
                to={`/mensagens/${sender._id}`}
                className="text-blue-600 hover:underline"
              >
                Conversa com <strong>{sender.name || "Usuário desconhecido"}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;

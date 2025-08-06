import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSuspendToggle() {
    if (!user) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}/suspend`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        fetchUser();
      }
    } catch (error) {
      console.error("Erro ao suspender usuário:", error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePromoteToAdmin() {
    if (!user) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}/promote`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        fetchUser();
      }
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p className="p-6">Carregando usuário...</p>;
  if (!user) return <p className="p-6">Usuário não encontrado</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
              user.isSuspended
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {user.isSuspended ? "Suspenso" : "Ativo"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 bg-white shadow p-6 rounded-lg mb-6">
        <p><strong>Telefone:</strong> {user.phoneNumber || "N/A"}</p>
        <p><strong>Localização:</strong> {user.location?.province} - {user.location?.city}</p>
        <p><strong>Nome da Loja:</strong> {user.storeName || "N/A"}</p>
        <p><strong>Avaliação do Vendedor:</strong> {user.sellerRating}</p>
        <p><strong>Produtos Vendidos:</strong> {user.productsSoldCount}</p>
        <p><strong>Total de Compras:</strong> {user.totalPurchasesCount}</p>
        <p><strong>Papel:</strong> {user.role}</p>
        <p><strong>Email Verificado:</strong> {user.emailVerified ? "Sim" : "Não"}</p>
        <p><strong>Linguagem:</strong> {user.language}</p>
        <p><strong>Tema:</strong> {user.theme}</p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSuspendToggle}
          disabled={actionLoading}
          className={`px-4 py-2 rounded-lg text-white ${
            user.isSuspended ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {user.isSuspended ? "Reativar Usuário" : "Suspender Usuário"}
        </button>
        {user.role !== "admin" && (
          <button
            onClick={handlePromoteToAdmin}
            disabled={actionLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Promover a Admin
          </button>
        )}
      </div>
    </div>
  );
}

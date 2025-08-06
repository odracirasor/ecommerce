import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, sortBy, sortOrder]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = new URL("http://localhost:5000/api/admin/users");
      url.searchParams.append("page", page);
      url.searchParams.append("limit", 20);
      url.searchParams.append("search", query);
      url.searchParams.append("sortBy", sortBy);
      url.searchParams.append("sortOrder", sortOrder);

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  async function handleAction(id, action) {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/admin/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>

      {/* Search & Sort */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar usuários..."
          className="border rounded px-3 py-2 flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="createdAt">Criado em</option>
          <option value="username">Nome de usuário</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Carregando usuários...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600 text-lg">Nenhum usuário encontrado.</p>
      ) : (
        <table className="w-full border-collapse border shadow-sm rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Usuário</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Papel</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 flex items-center space-x-3">
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border"
                  />
                  <span>{u.username}</span>
                </td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      u.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {u.isSuspended ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                      Suspenso
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      Ativo
                    </span>
                  )}
                </td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <Link
                    to={`/admin/users/${u._id}`}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleAction(u._id, "promote")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Promover
                  </button>
                  <button
                    onClick={() => handleAction(u._id, "suspend")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    {u.isSuspended ? "Reativar" : "Suspender"}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

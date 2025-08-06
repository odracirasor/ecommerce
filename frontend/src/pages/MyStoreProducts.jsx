import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchUsers();
  }, [page, sortBy, sortOrder]);

  async function fetchUsers() {
    const token = localStorage.getItem("token");
    const url = new URL("http://localhost:5000/api/admin");
    url.searchParams.append("page", page);
    url.searchParams.append("limit", 20);
    url.searchParams.append("search", query);
    url.searchParams.append("sortBy", sortBy);
    url.searchParams.append("sortOrder", sortOrder);

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();

    setUsers(data.users || []);
    setTotalPages(data.totalPages || 1);
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
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* Search & Sort */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="border rounded px-3 py-2 flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="createdAt">Created At</option>
          <option value="username">Username</option>
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border px-4 py-2">{u.username}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2 space-x-2">
                <Link
                  to={`/admin/users/${u._id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleAction(u._id, "promote")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Promote
                </button>
                <button
                  onClick={() => handleAction(u._id, "suspend")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

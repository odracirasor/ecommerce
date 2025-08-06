import { useEffect, useState } from "react";

export default function AdminSuspendedUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchSuspended();
  }, []);

  async function fetchSuspended() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/suspended", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  }

  async function handleUnsuspend(id) {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/admin/${id}/unsuspend`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSuspended();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Suspended Users</h1>
      {users.length === 0 ? (
        <p>No suspended users found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleUnsuspend(u._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Unsuspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

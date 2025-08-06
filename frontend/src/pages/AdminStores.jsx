import { useEffect, useState } from "react";

export default function AdminStores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/stores", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStores(data);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stores</h1>
      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Store Name</th>
              <th className="border px-4 py-2">Owner</th>
              <th className="border px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s._id}>
                <td className="border px-4 py-2">{s.name}</td>
                <td className="border px-4 py-2">{s.owner?.name}</td>
                <td className="border px-4 py-2">{s.owner?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);
  }

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Total Stores</h2>
          <p className="text-2xl">{stats.totalStores}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Suspended Users</h2>
          <p className="text-2xl">{stats.suspendedUsers}</p>
        </div>
      </div>
    </div>
  );
}

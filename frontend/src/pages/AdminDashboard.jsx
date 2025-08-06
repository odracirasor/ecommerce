import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/admin/users"
          className="bg-white shadow rounded p-6 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Manage Users</h2>
        </Link>
        <Link
          to="/admin/users/suspended"
          className="bg-white shadow rounded p-6 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Suspended Users</h2>
        </Link>
        <Link
          to="/admin/stores"
          className="bg-white shadow rounded p-6 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Manage Stores</h2>
        </Link>
        <Link
          to="/admin/stats"
          className="bg-white shadow rounded p-6 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Statistics</h2>
        </Link>
      </div>
    </div>
  );
}

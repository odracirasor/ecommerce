import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/admin/users?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const promoteToAdmin = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Erro ao promover usuário:', err);
    }
  };

  const suspendUser = async (id) => {
    if (!window.confirm('⚠️ Suspender este usuário?')) return;
    try {
      await axios.put(`/api/admin/users/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Erro ao suspender usuário:', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 Gerenciar Usuários</h1>

      <input
        type="text"
        placeholder="🔍 Buscar por nome ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-3 border border-gray-300 rounded w-full max-w-md focus:outline-none focus:ring focus:border-blue-400"
      />

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">👤 Nome</th>
              <th className="p-4 text-left">📧 Email</th>
              <th className="p-4 text-center">🔐 Admin</th>
              <th className="p-4 text-center">🚫 Suspenso</th>
              <th className="p-4 text-center">⚙️ Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">
                  <Link to={`/profile/${u._id}`} className="text-blue-600 hover:underline">
                    {u.name}
                  </Link>
                </td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 text-center">{u.isAdmin ? '✅' : '❌'}</td>
                <td className="p-4 text-center">{u.suspended ? '🚫' : '✔️'}</td>
                <td className="p-4 text-center space-x-2">
                  {!u.isAdmin && (
                    <button
                      onClick={() => promoteToAdmin(u._id)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                    >
                      Tornar Admin
                    </button>
                  )}
                  {!u.suspended && (
                    <button
                      onClick={() => suspendUser(u._id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                    >
                      Suspender
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

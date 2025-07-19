import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
    if (!window.confirm('Suspender este usuário?')) return;
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>

      <input
        type="text"
        placeholder="🔍 Buscar por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Admin</th>
            <th className="p-3 text-left">Suspenso</th>
            <th className="p-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.isAdmin ? '✅' : '❌'}</td>
              <td className="p-3">{u.suspended ? '🚫' : '✔️'}</td>
              <td className="p-3 flex gap-2">
                {!u.isAdmin && (
                  <button onClick={() => promoteToAdmin(u._id)} className="text-blue-500 hover:underline">
                    Tornar Admin
                  </button>
                )}
                {!u.suspended && (
                  <button onClick={() => suspendUser(u._id)} className="text-red-500 hover:underline">
                    Suspender
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const mockSuggestions = [
  {
    _id: "1",
    name: "Smartphone Galaxy A54",
    category: "Eletrónica",
    price: 240000,
    image: "https://images.samsung.com/is/image/samsung/assets/africa_pt/galaxy-a54.jpg",
  },
  {
    _id: "2",
    name: "Tênis Nike Air",
    category: "Calçados",
    price: 85000,
    image: "https://static.nike.com/a/images/t_prod_ss/w_960,c_limit,f_auto/air-max.jpg",
  },
  {
    _id: "3",
    name: "Camiseta Oversized",
    category: "Roupas",
    price: 9500,
    image: "https://cdn.shopify.com/s/files/1/0729/0066/2089/products/camiseta.jpg",
  },
];

const Profile = () => {
  const { userId } = useParams();
  const { currentUser, token } = useAuth();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [balance, setBalance] = useState(0);
  const [suggestions] = useState(mockSuggestions);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data.user || res.data;
      setUser(userData);
      setReviews(res.data.reviews || []);
      setBalance(res.data.balance || 0);
    } catch (err) {
      setError("Erro ao carregar perfil.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const promoteToAdmin = async () => {
    try {
      await axios.put(`/api/admin/users/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUser();
    } catch (err) {
      console.error("Erro ao promover:", err);
    }
  };

  const suspendUser = async () => {
    if (!window.confirm("⚠️ Suspender este usuário?")) return;
    try {
      await axios.put(`/api/admin/users/${userId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUser();
    } catch (err) {
      console.error("Erro ao suspender:", err);
    }
  };

  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!user) return <div className="text-center mt-10 animate-pulse text-gray-500">🔄 Carregando perfil...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 👤 Perfil */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-20 h-20 rounded-full border object-cover shadow"
          />
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              {user.isAdmin ? "👑 Administrador" : "🙋‍♂️ Usuário comum"}
            </p>
            <p className="text-sm text-gray-500">
              {user.suspended ? "🚫 Suspenso" : "✔️ Ativo"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {currentUser?._id === user._id && (
            <Link
              to={`/editar-perfil/${user._id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
              ✏️ Editar Perfil
            </Link>
          )}

          {currentUser && currentUser._id !== user._id && (
            <Link
              to={`/mensagens/${user._id}`}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              📩 Mensagem
            </Link>
          )}
        </div>
      </div>

      {/* Admin Actions */}
      {currentUser?.isAdmin && currentUser._id !== user._id && (
        <div className="mb-6 space-x-4">
          {!user.isAdmin && (
            <button
              onClick={promoteToAdmin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Tornar Admin
            </button>
          )}
          {!user.suspended && (
            <button
              onClick={suspendUser}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Suspender
            </button>
          )}
        </div>
      )}

      {/* 💰 Saldo */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow border">
        <h2 className="text-lg font-semibold mb-2">💰 Saldo</h2>
        <p className="text-2xl font-bold text-green-600">Kz {balance.toFixed(2)}</p>
      </div>

      {/* Avaliações + Sugestões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📝 Avaliações */}
        <div>
          <h2 className="text-xl font-semibold mb-3">📝 Avaliações de Produtos</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">Nenhuma avaliação ainda.</p>
          ) : (
            <ul className="space-y-2">
              {reviews.map((r) => (
                <li key={r._id} className="bg-white p-3 rounded shadow border">
                  <Link to={`/produto/${r.productId}`} className="text-blue-700 font-medium hover:underline">
                    {r.productName}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
                  <p className="text-sm text-yellow-600">⭐ {r.rating}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        {currentUser && currentUser._id !== user._id && (
  <Link
    to={`/mensagens/${user._id}`}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
  >
    📩 Mensagem
  </Link>
)}

        {/* 🎁 Recomendações */}
        <div>
          <h2 className="text-xl font-semibold mb-3">🎁 Sugestões para você</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((s) => (
              <div key={s._id} className="bg-white rounded shadow border p-3 hover:shadow-lg transition">
                <img src={s.image} alt={s.name} className="w-full h-32 object-cover rounded mb-2" />
                <Link to={`/produto/${s._id}`} className="font-semibold text-green-700 hover:underline block">
                  {s.name}
                </Link>
                <p className="text-sm text-gray-500">Categoria: {s.category}</p>
                <p className="text-sm font-bold">Kz {s.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

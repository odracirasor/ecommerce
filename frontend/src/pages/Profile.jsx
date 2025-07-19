import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error((await res.json()).error || "Erro ao carregar perfil.");
        const data = await res.json();
        setUser(data);
        setBalance(data.balance || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews/seller`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao buscar avaliações.");
        setReviews(data);
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err.message);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/suggestions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao buscar sugestões.");
        setSuggestions(data);
      } catch (err) {
        console.error("Erro ao buscar sugestões:", err.message);
      }
    };

    fetchProfile();
    fetchReviews();
    fetchSuggestions();
  }, []);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Erro no upload.");

      const updateRes = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profileImage: uploadData.imageUrl }),
      });

      const updatedUser = await updateRes.json();
      if (!updateRes.ok) throw new Error("Erro ao atualizar imagem.");

      setUser(updatedUser);
    } catch (err) {
      alert("Erro ao atualizar imagem: " + err.message);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    setWithdrawMessage("");
    try {
      const res = await fetch(`${API_URL}/api/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: balance }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao solicitar retirada.");

      setWithdrawMessage("✅ Retirada solicitada com sucesso.");
      setBalance(0);
    } catch (err) {
      setWithdrawMessage("❌ Erro: " + err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <p className="p-6">Carregando perfil...</p>;
  if (error) return <p className="p-6 text-red-600">Erro: {error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Meu Perfil</h1>

      <div className="flex items-start gap-6 border p-4 rounded shadow">
        <div className="w-32 h-32">
          <img
            src={user.profileImage || "https://via.placeholder.com/150?text=Foto"}
            alt="Foto de perfil"
            className="rounded-full w-32 h-32 object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Endereço:</strong> {user.address || "Não informado"}</p>
          <p><strong>Província:</strong> {user.province || "Não informada"}</p>
          {averageRating && (
            <p><strong>Média de Avaliação:</strong> ⭐ {averageRating} ({reviews.length} avaliações)</p>
          )}
          <p><strong>Saldo disponível:</strong> Kz {Number(balance).toLocaleString("pt-AO")}</p>
          <button
            onClick={handleWithdraw}
            disabled={balance <= 0 || withdrawing}
            className={`px-4 py-2 rounded text-white ${
              balance > 0 && !withdrawing ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {withdrawing ? "Solicitando..." : "Solicitar Retirada"}
          </button>
          {withdrawMessage && <p className="text-sm mt-1">{withdrawMessage}</p>}
        </div>
      </div>

      <Link
        to="/post-product"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Publicar Novo Produto
      </Link>

      {reviews.length > 0 && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">📋 Avaliações</h2>
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r._id} className="border p-3 rounded bg-gray-50">
                <div className="flex items-center gap-3 mb-1">
                  <img
                    src={r.buyerImage || "https://via.placeholder.com/40"}
                    alt={r.buyerName}
                    className="w-8 h-8 rounded-full"
                  />
                  <strong>{r.buyerName}</strong> — ⭐ {r.rating}
                </div>
                <p className="text-gray-700">{r.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">🔎 Sugestões para você</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {suggestions.map((product) => (
              <li key={product._id} className="border rounded p-2 shadow-sm">
                <img src={product.image} alt={product.title} className="w-full h-32 object-cover rounded mb-2" />
                <h3 className="font-medium">{product.title}</h3>
                <p className="text-blue-700 font-bold">Kz {product.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;

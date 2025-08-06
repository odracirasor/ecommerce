import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({ avatarUrl: "", bio: "", phoneNumber: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(data.user);
      } catch (err) {
        setError("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditOpen = () => {
    if (user) {
      setFormData({
        avatarUrl: user.avatarUrl || "",
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || "",
      });
      setIsEditOpen(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        { ...formData },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser((prev) => ({ ...prev, ...data.user }));
      setIsEditOpen(false);
    } catch (err) {
      alert("Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-600">Carregando perfil...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  if (!user) return <div className="flex justify-center items-center h-64 text-gray-600">Nenhum dado disponível</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user.avatarUrl || "/default-avatar.png"}
          alt={user.username}
          className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-100"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1 capitalize">{user.role}</p>
          {user.bio && <p className="mt-4 text-gray-700 max-w-xl">{user.bio}</p>}
        </div>
        <button
          onClick={handleEditOpen}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Edit3 size={18} /> Editar
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Contato</h2>
          <p className="text-gray-700"><span className="font-medium">Telefone:</span> {user.phoneNumber || "Não informado"}</p>
          {user.location && (
            <p className="text-gray-700">
              <span className="font-medium">Localização:</span> {user.location.city || "Cidade não informada"},{" "}
              {user.location.province || "Província não informada"}
            </p>
          )}
        </div>

        {/* Seller Info */}
        {user.role === "seller" && (
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Informações da Loja</h2>
            <p className="text-gray-700"><span className="font-medium">Nome da Loja:</span> {user.storeName || "Sem nome"}</p>
            <p className="text-gray-700"><span className="font-medium">Avaliação:</span> {user.sellerRating?.toFixed(1)} / 5</p>
            <p className="text-gray-700"><span className="font-medium">Produtos Vendidos:</span> {user.productsSoldCount}</p>
          </div>
        )}

        {/* Activity */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Atividade</h2>
          <p className="text-gray-700"><span className="font-medium">Total de Compras:</span> {user.totalPurchasesCount}</p>
          <p className="text-gray-700"><span className="font-medium">Itens na Wishlist:</span> {user.wishlist?.length}</p>
          <p className="text-gray-700"><span className="font-medium">Itens no Carrinho:</span> {user.cart?.length}</p>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Preferências</h2>
          <p className="text-gray-700"><span className="font-medium">Categorias Preferidas:</span> {user.preferredCategories?.length ? user.preferredCategories.join(", ") : "Nenhuma"}</p>
          <p className="text-gray-700"><span className="font-medium">Idioma:</span> {user.language}</p>
          <p className="text-gray-700"><span className="font-medium">Tema:</span> {user.theme}</p>
          <p className="text-gray-700"><span className="font-medium">Notificações:</span> {user.notificationsEnabled ? "Ativadas" : "Desativadas"}</p>
          <p className="text-gray-700"><span className="font-medium">2FA:</span> {user.twoFactorEnabled ? "Ativado" : "Desativado"}</p>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Visualizados Recentemente</h2>
        {user.recentlyViewed?.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {user.recentlyViewed.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">Nenhum produto visualizado recentemente</p>
        )}
      </div>

      {/* Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <h2 className="text-2xl font-semibold mb-4">Editar Perfil</h2>
            <label className="block mb-2 font-medium text-gray-700">URL do Avatar</label>
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full border rounded-lg p-2 mb-4"
            />
            <label className="block mb-2 font-medium text-gray-700">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border rounded-lg p-2 mb-4"
            />
            <label className="block mb-2 font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full border rounded-lg p-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

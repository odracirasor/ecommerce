import React, { useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("currentUser")) || {
        name: "",
        email: "",
        address: "",
        profileImage: null,
      }
    );
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3001/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erro ao fazer upload da imagem.");
      }

      const data = await res.json();

      const updated = { ...user, profileImage: data.imageUrl };
      setUser(updated);
      localStorage.setItem("currentUser", JSON.stringify(updated));
    } catch (err) {
      console.error("Upload error:", err.message);
      alert("Erro ao fazer upload da imagem.");
    }
  };

  const posts = [
    {
      id: 1,
      description: "Adicionou 'Fones de Ouvido' ao catálogo.",
      date: "2025-07-14",
      author: user.name,
    },
    {
      id: 2,
      description: "Atualizou o estoque do 'Smartphone X1'.",
      date: "2025-07-13",
      author: user.name,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

      {/* Dados do usuário */}
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
        <div className="space-y-1">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Endereço:</strong> {user.address}</p>
        </div>
      </div>

      {/* Botão para postar produto */}
      <div>
        <Link
          to="/post-product"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Publicar Novo Produto
        </Link>
      </div>

      {/* Atividades do usuário */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Minhas Atividades</h2>
        {posts.length === 0 ? (
          <p>Nenhuma atividade ainda.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="border rounded p-4 shadow">
                <p className="text-gray-800">{post.description}</p>
                <p className="text-sm text-gray-500">
                  📅 {new Date(post.date).toLocaleDateString()} — 👤 {post.author}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;

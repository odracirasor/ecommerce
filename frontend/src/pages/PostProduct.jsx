import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // para pegar currentUser

const categories = [
  "Electrónica", "Roupas", "Calçados", "Alimentos", "Móveis",
  "Telemóveis", "Acessórios", "Beleza", "Casa & Cozinha",
  "Desporto", "Brinquedos"
];

const PostProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const priceNumber = parseFloat(price);

    if (!name || !price || !description || !imageFile) {
      setError("Preencha todos os campos e envie uma imagem.");
      setLoading(false);
      return;
    }

    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError("O preço deve ser um número positivo.");
      setLoading(false);
      return;
    }

    try {
      // Upload da imagem
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await fetch("http://localhost:5000/api/products/upload", {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || "Erro ao enviar imagem.");

      const imageUrl = uploadData.imageUrl;

      // Enviar produto
      const product = {
        name,
        price: priceNumber,
        category,
        description,
        image: imageUrl,
        author: currentUser?.name || "Anônimo"
      };

      const saveRes = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });

      if (!saveRes.ok) throw new Error("Erro ao salvar produto.");

      alert("✅ Produto publicado com sucesso!");

      // Limpar formulário
      setName("");
      setPrice("");
      setCategory(categories[0]);
      setDescription("");
      setImageFile(null);
      setImagePreview(null);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao publicar o produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Postar Novo Produto</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome do Produto"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Preço em Kz"
          min="1"
          className="w-full border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <textarea
          placeholder="Descrição do Produto"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            onError={(e) => (e.target.src = "/placeholder.png")} // fallback caso preview falhe
            className="w-full h-48 object-cover rounded shadow"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Publicando..." : "Publicar Produto"}
        </button>
      </form>
    </div>
  );
};

export default PostProduct;

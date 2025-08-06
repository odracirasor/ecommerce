import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const NewProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });
  const [image, setImage] = useState(null);
  const { token } = useAuth(); // ✅ pega token diretamente do contexto

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("❌ Usuário não autenticado.");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category);
    if (image) formData.append("image", image);

    try {
      await axios.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` // ✅ token correto aqui
        }
      });
      alert("✅ Produto adicionado com sucesso!");
    } catch (err) {
      alert("❌ Erro ao adicionar produto.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Novo Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" placeholder="Nome" onChange={handleChange} required className="w-full border p-2" />
        <input type="text" name="description" placeholder="Descrição" onChange={handleChange} required className="w-full border p-2" />
        <input type="number" name="price" placeholder="Preço" onChange={handleChange} required className="w-full border p-2" />
        <input type="text" name="category" placeholder="Categoria" onChange={handleChange} required className="w-full border p-2" />
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" required className="w-full border p-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default NewProduct;

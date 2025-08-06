import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdateProductPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (res.ok) setForm(data.product);
    }
    fetchProduct();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(res.ok ? "Produto atualizado!" : data.message);
    } catch (err) {
      setMessage("Erro ao atualizar produto.");
    }
  }

  if (!form) return <p>Carregando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Editar Produto</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} />
        <textarea name="description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" value={form.price} onChange={handleChange} />
        <input name="category" value={form.category} onChange={handleChange} />
        <input name="brand" value={form.brand} onChange={handleChange} />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} />
        <button type="submit">Salvar Alterações</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminCreateCategoryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parent, setParent] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (!data.success) throw new Error("Falha ao carregar categorias");
        setCategories(data.categories);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, image, parent }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar categoria");

      alert("Categoria criada com sucesso!");
      navigate("/categories");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Criar Categoria</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <label>
          Nome:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Descrição:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Imagem (URL):
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </label>
        <label>
          Categoria Pai (opcional):
          <select value={parent} onChange={(e) => setParent(e.target.value)}>
            <option value="">Nenhuma</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Categoria"}
        </button>
      </form>
    </div>
  );
}

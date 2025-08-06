import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminEditCategoryPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategory() {
      const res = await fetch(`/api/categories/${id}`);
      const data = await res.json();
      setName(data.category.name);
      setDescription(data.category.description);
      setImage(data.category.image);
    }
    fetchCategory();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, description, image }),
    });
    navigate("/categories");
  }

  return (
    <form onSubmit={handleUpdate} style={{ padding: "20px" }}>
      <h1>Editar Categoria</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <input value={image} onChange={(e) => setImage(e.target.value)} />
      <button type="submit">Atualizar</button>
    </form>
  );
}

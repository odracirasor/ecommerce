import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        const res = await fetch(`/api/categories/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error("Erro ao carregar categoria");
        setCategory(data.category);
      } catch (error) {
        console.error(error);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  if (loading) return <p>Carregando categoria...</p>;
  if (!category) return <p>Categoria não encontrada</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{category.name}</h1>
      {category.description && <p>{category.description}</p>}
      {category.parent && (
        <p>
          Subcategoria de:{" "}
          <Link to={`/categories/${category.parent._id}`}>{category.parent.name}</Link>
        </p>
      )}
    </div>
  );
}

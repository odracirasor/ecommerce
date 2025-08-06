import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch(`/api/categories?q=${search}&page=${page}&limit=${limit}`);
        const data = await res.json();
        if (!data.success) throw new Error("Failed to load categories");
        setCategories(data.categories);
        setTotal(data.total);
      } catch (error) {
        console.error(error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [search, page, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Categorias</h1>

      <input
        type="text"
        placeholder="Pesquisar categorias..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ padding: "8px", width: "250px", marginBottom: "20px" }}
      />

      {loading ? (
        <p>Carregando categorias...</p>
      ) : categories.length ? (
        <>
          <ul>
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link to={`/categories/${cat._id}`}>{cat.name}</Link>
                {cat.parent && <span style={{ marginLeft: "10px", fontSize: "12px", color: "#555" }}>
                  (Subcategoria de {cat.parent.name})
                </span>}
              </li>
            ))}
          </ul>

          {/* Paginação */}
          <div style={{ marginTop: "20px" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  background: page === i + 1 ? "#007bff" : "#f0f0f0",
                  color: page === i + 1 ? "#fff" : "#000",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Nenhuma categoria encontrada.</p>
      )}
    </div>
  );
}

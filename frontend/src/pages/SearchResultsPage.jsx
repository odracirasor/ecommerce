import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function SearchResultsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Get ?q= from URL
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    if (query) fetchData();
  }, [query]);

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Resultados da busca: "{query}"
      </h1>
      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <p className="font-bold text-green-600">{product.price} KZ</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

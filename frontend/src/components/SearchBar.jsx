import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSuggestions(data.products || []);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="flex items-center border rounded overflow-hidden">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 outline-none text-gray-700"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
          Buscar
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border mt-1 rounded shadow z-50">
          {loading ? (
            <li className="p-2 text-gray-500">Carregando...</li>
          ) : (
            suggestions.map((product) => (
              <li
                key={product._id}
                onClick={() => {
                  navigate(`/products/${product._id}`);
                  setSuggestions([]);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {product.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

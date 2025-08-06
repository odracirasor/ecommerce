import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const SearchResults = ({ isAdmin, isSeller, addToCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://ecommerce-oclq.onrender.com/api/products");
        const data = await res.json();

        const matched = data.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(matched);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [searchTerm]);

  return (
    <div className="px-4 py-4 text-sm">
      {/* Info de correspondência */}
      {!loading && (
        <p className="mt-4 text-gray-700 text-sm">
          <strong>{products.length}</strong>{" "}
          correspondência{products.length !== 1 ? "s" : ""} encontrada
          {products.length !== 1 ? "s" : ""} para{" "}
          <span className="italic">"{searchTerm}"</span>
        </p>
      )}

      {/* Grade de produtos */}
      {loading ? (
        <p className="text-gray-500 mt-4">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 mt-4">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => addToCart(product)}
              isAdmin={isAdmin}
              isSeller={isSeller}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

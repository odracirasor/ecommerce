import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/store-products/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao carregar produtos.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/store-products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
      setMessage("Erro ao excluir produto.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Meus Produtos</h2>
      {message && <p className="text-red-600">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
          >
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-500">{product.description}</p>
            <span className="text-blue-600 font-bold">Kz {product.price}</span>
            <button
              onClick={() => deleteProduct(product._id)}
              className="mt-4 bg-red-500 text-white py-1 rounded hover:bg-red-600"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

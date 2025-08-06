import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
      setError('');
    } catch (err) {
      setError('Erro ao buscar produtos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Deseja mesmo deletar este produto?')) return;

    try {
      await axios.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      alert('Erro ao deletar produto.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📦 Gerenciar Produtos</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          + Adicionar Produto
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando produtos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="text-left p-4">Nome</th>
                <th className="text-left p-4">Preço</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{prod.name}</td>
                  <td className="p-4">Kz {prod.price}</td>
                  <td className="p-4">{prod.stock}</td>
                  <td className="p-4 space-x-3">
                    <Link
                      to={`/admin/products/${prod._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteProduct(prod._id)}
                      className="text-red-600 hover:underline"
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

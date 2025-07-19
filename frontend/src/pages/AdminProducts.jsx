import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
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
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Link to="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Adicionar Produto
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left p-3">Nome</th>
            <th className="text-left p-3">Preço</th>
            <th className="text-left p-3">Stock</th>
            <th className="text-left p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} className="border-b">
              <td className="p-3">{prod.name}</td>
              <td className="p-3">Kz {prod.price}</td>
              <td className="p-3">{prod.stock}</td>
              <td className="p-3">
                <Link to={`/admin/products/${prod._id}/edit`} className="text-blue-500 hover:underline mr-2">Editar</Link>
                <button onClick={() => deleteProduct(prod._id)} className="text-red-500 hover:underline">Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;

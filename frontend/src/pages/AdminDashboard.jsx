import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>
      <p>Resumo rápido das métricas:</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Total de Produtos</h2>
          <p className="text-blue-600 text-2xl">120</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Pedidos Pendentes</h2>
          <p className="text-yellow-500 text-2xl">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Usuários Registrados</h2>
          <p className="text-green-600 text-2xl">342</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Vendas Hoje</h2>
          <p className="text-purple-600 text-2xl">Kz 17.000</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; // ✅ ESSENCIAL

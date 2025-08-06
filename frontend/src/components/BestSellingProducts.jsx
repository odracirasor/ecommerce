import React from "react";

const BestSellingProducts = ({ products }) => (
  <div className="mt-10">
    <h2 className="text-2xl font-bold mb-4">🔥 Produtos Mais Vendidos</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...products].reverse().map((item) => (
        <div key={item.id} className="bg-white p-3 rounded shadow">
          <img src={item.image} alt={item.name} className="w-full h-40 object-cover mb-2 rounded" />
          <h4 className="text-sm font-semibold">{item.name}</h4>
          <p className="text-green-600 font-bold">Kz {item.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  </div>
);

export default BestSellingProducts;

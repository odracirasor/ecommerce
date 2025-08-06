import React from "react";
import { FaShoppingBag } from "react-icons/fa";

const Compras = () => {
  // Exemplo vazio, substitua depois por dados reais
  const compras = [];

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6 text-center">
        <div className="flex justify-center items-center mb-4">
          <FaShoppingBag className="text-3xl text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Minhas Compras</h1>
        </div>

        {compras.length === 0 ? (
          <div className="text-gray-600">
            <p className="text-lg">🛒 Você ainda não fez nenhuma compra.</p>
            <p className="text-sm text-gray-400 mt-1">Seu histórico aparecerá aqui assim que você comprar algo.</p>
          </div>
        ) : (
          <ul className="space-y-4 mt-6 text-left">
            {compras.map((compra) => (
              <li
                key={compra._id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold">{compra.product.title}</h2>
                <p className="text-gray-600">
                  Preço: <span className="font-bold">{(compra.product.price / 100).toLocaleString("pt-AO")} Kz</span>
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Data: {new Date(compra.createdAt).toLocaleString()}
                </p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
                  {compra.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Compras;

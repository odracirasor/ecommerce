import React from "react";
import { FaTrash } from "react-icons/fa";
import Draggable from "react-draggable";
import { Link } from "react-router-dom"; // <-- importar Link

const MiniCart = ({ cart, onRemoveItem, totalPrice, onClose }) => {
  return (
    <Draggable>
      <div className="fixed bottom-20 right-4 w-80 bg-blue-100 border border-blue-300 rounded-lg shadow-lg p-4 z-50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blue-700">Carrinho</h2>
          <button onClick={onClose} className="text-sm text-blue-600 hover:underline">
            Fechar
          </button>
        </div>

        {(!cart || cart.length === 0) ? (
          <p className="text-gray-600">Carrinho vazio</p>
        ) : (
          <>
            <ul className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <li key={item._id} className="flex items-center gap-3 bg-white p-2 rounded shadow-sm">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded cursor-pointer hover:opacity-90"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-right">
              <p className="text-blue-700 font-semibold">
                Total: {totalPrice.toFixed(2)} Kz
              </p>
            </div>

            <div className="mt-2 text-right">
              <button
                onClick={() => window.location.href = "/checkout"}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Proceder ao Pagamento
              </button>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default MiniCart;

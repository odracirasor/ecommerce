import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      setError("Por favor, selecione um método de pagamento.");
      return;
    }

    alert("Pagamento confirmado com sucesso!");
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💳 Pagamento</h1>
      <p className="mb-4">Escolha o método de pagamento para finalizar sua compra:</p>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Método de Pagamento:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="cash">Dinheiro na entrega</option>
            <option value="transfer">Transferência bancária</option>
            <option value="mobile">Pagamento por telemóvel</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Confirmar Pagamento
        </button>
      </form>
    </div>
  );
};

export default Payment;

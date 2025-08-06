import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Withdraw = () => {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState("");

  const handleWithdraw = () => {
    const numericAmount = parseFloat(amount);

    if (!numericAmount || numericAmount <= 0) {
      alert("❌ Insira um valor válido (maior que zero).");
      return;
    }

    if (numericAmount > (currentUser?.balance ?? 0)) {
      alert("❌ O valor excede o saldo disponível.");
      return;
    }

    alert(`✅ Solicitação de saque de ${numericAmount.toLocaleString("pt-AO")} Kz enviada.`);
    setAmount("");
  };

  const formattedBalance = (currentUser?.balance ?? 0).toLocaleString("pt-AO");

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Solicitar Saque</h1>
        <p className="mb-6 text-gray-700">
          Saldo disponível: <strong>{formattedBalance} Kz</strong>
        </p>

        <input
          type="number"
          min="1"
          placeholder="Valor do saque"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleWithdraw}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sacar
        </button>
      </div>
    </div>
  );
};

export default Withdraw;

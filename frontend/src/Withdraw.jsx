import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Withdraw = () => {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    // Aqui você chamaria uma API para sacar
    alert(`Solicitado saque de ${amount} Kz`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Solicitar Saque</h1>
      <p>Saldo disponível: {currentUser?.balance ?? 0} Kz</p>
      <input
        type="number"
        placeholder="Valor do saque"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handleWithdraw}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sacar
      </button>
    </div>
  );
};

export default Withdraw;

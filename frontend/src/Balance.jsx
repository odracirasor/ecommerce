import React from "react";
import { useAuth } from "../context/AuthContext";

const Balance = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Carregando saldo...</p>
      </div>
    );
  }

  const formattedBalance = (currentUser.balance ?? 0).toLocaleString("pt-AO");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Meu Saldo</h1>
        <p className="text-3xl font-semibold text-green-600">{formattedBalance} Kz</p>
      </div>
    </div>
  );
};

export default Balance;

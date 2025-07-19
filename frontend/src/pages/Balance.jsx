import React from "react";
import { useAuth } from "../context/AuthContext";

const Balance = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Meu Saldo</h1>
      <p>Saldo atual: {currentUser?.balance ?? 0} Kz</p>
    </div>
  );
};

export default Balance; // ESSA LINHA É OBRIGATÓRIA!

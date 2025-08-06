import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Balance = () => {
  const { currentUser, token } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erro ao buscar saldo");
        }

        setBalance(data.balance);
      } catch (err) {
        console.error("Erro ao buscar saldo:", err.message);
        setBalance(0); // fallback
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBalance();
    }
  }, [token]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">💰 Meu Saldo</h1>
      {loading ? (
        <p className="text-gray-500">Carregando saldo...</p>
      ) : (
        <p className="text-lg text-green-700 font-semibold">
          Saldo atual: {balance ?? 0} Kz
        </p>
      )}
    </div>
  );
};

export default Balance;

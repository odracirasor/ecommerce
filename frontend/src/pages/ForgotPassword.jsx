// src/pages/ForgotPassword.jsx
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao enviar email de recuperação.");
      } else {
        setMessage("Email de recuperação enviado! Verifique sua caixa de entrada.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Recuperar Senha</h2>

      {message && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded border border-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Enviar link de recuperação
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

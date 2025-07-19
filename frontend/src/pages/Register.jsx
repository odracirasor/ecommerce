import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes("username")) {
          setError("⚠️ Nome de usuário já está em uso.");
        } else if (data.error && data.error.includes("email")) {
          setError("⚠️ E-mail já está em uso.");
        } else {
          setError(data.error || "Erro ao registrar.");
        }
        return;
      }

      setSuccessMessage("✅ Conta criada! Verifique seu e-mail para confirmar.");
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      console.error("Erro de rede:", err);
      setError("Erro de rede. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registre-se</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded border border-red-300">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded border border-green-300">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full border p-2 rounded ${
            error.toLowerCase().includes("usuário") ? "border-red-500" : ""
          }`}
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border p-2 rounded ${
            error.toLowerCase().includes("e-mail") ? "border-red-500" : ""
          }`}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border p-2 rounded ${
              error.toLowerCase().includes("senha") ? "border-red-500" : ""
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2 right-3 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full border p-2 rounded ${
            error.toLowerCase().includes("coincidem") ? "border-red-500" : ""
          }`}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Criando..." : "Criar Conta"}
        </button>
      </form>
    </div>
  );
};

export default Register;

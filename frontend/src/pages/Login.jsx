import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth(); // ✅ usa AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: identifier,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      // Salva no contexto
      login({
        email: identifier,
        token: data.token,
        isAdmin: data.isAdmin
      });

      setError("");

      // Redireciona dependendo do tipo de usuário
      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      console.error("Erro ao conectar:", err);
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Entrar
        </button>
      </form>

      <div className="mt-4 text-sm text-center text-gray-600 space-y-2">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Esqueceu a senha?
        </Link>
        <br />
        <span>
          Não tem uma conta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registre-se
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: identifier, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciais inválidas. Verifique seu email e senha.");
        return;
      }

      // ✅ Salva o token no localStorage
      localStorage.setItem("token", data.token);

      // ✅ Confirmação no console
      const storedToken = localStorage.getItem("token");
      console.log("Token armazenado:", storedToken);

      // ✅ Salva os dados no contexto
      login({
        email: data.user?.email,
        token: data.token,
        isAdmin: data.user?.isAdmin,
        _id: data.user?._id,
        username: data.user?.username,
      });

      // ✅ Redireciona para /admin ou /profile
      navigate(data.user?.isAdmin ? "/admin" : "/profile");

    } catch (err) {
      console.error("Erro ao conectar:", err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
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
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full border p-2 rounded"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            autoComplete="current-password"
            className="w-full border p-2 rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-blue-600"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

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

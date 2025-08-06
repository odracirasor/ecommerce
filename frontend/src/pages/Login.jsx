import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStore, setIsStore] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isStore ? "/api/stores/login" : "/api/users/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao efetuar login");

      localStorage.setItem("token", data.token);

      navigate(isStore ? "/store/profile" : "/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isStore ? "Login de Loja" : "Login de Usuário"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isStore}
              onChange={() => setIsStore(!isStore)}
              className="w-4 h-4"
            />
            <span>Entrar como Loja</span>
          </label>
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Não tem conta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

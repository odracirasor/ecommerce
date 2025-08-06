import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StoreLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/stores/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao autenticar");

      // Salva token e dados básicos
      localStorage.setItem("storeToken", data.token);
      localStorage.setItem(
        "storeInfo",
        JSON.stringify({ _id: data._id, name: data.name, email: data.email })
      );

      // Redireciona para perfil
      navigate("/store/profile");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1>Login da Loja</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          placeholder="Email da Loja"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

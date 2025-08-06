import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterStorePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage("As senhas não coincidem!");
    }
    try {
      const res = await fetch("http://localhost:5000/api/stores/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no registro");
      setMessage("Loja registrada com sucesso! Aguarde aprovação do administrador.");
      setTimeout(() => navigate("/store/login"), 2000);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Registrar Loja</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nome da Loja"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email da Loja"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Registrar</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  button: { padding: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  message: { marginBottom: "10px", color: "#d9534f" }
};

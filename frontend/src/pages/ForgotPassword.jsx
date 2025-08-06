import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Por favor, digite seu email." });
      return;
    }
    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Digite um email válido." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await api.post("/forgot-password", { email });
      setMessage({ type: "success", text: data || "Email de recuperação enviado!" });
    } catch {
      setMessage({ type: "error", text: "Erro ao enviar email. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Esqueci a Senha</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {message.text && (
        <p style={message.type === "error" ? styles.error : styles.success}>{message.text}</p>
      )}

      <div style={styles.links}>
        <Link to="/login" style={styles.link}>Voltar para Login</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  links: { marginTop: "15px", textAlign: "center" },
  link: { textDecoration: "none", color: "#007bff" },
  error: { color: "#d9534f", textAlign: "center", marginTop: "10px" },
  success: { color: "#28a745", textAlign: "center", marginTop: "10px" },
};

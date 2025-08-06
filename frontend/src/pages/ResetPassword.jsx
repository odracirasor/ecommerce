import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const validatePassword = () => {
    if (!password || password.length < 6) {
      setMessage({ type: "error", text: "A senha deve ter pelo menos 6 caracteres." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post(`/reset-password/${token}`, { password });
      setMessage({ type: "success", text: "Senha redefinida com sucesso!" });
      setTimeout(() => navigate("/login"), 2000); // redireciona para login
    } catch {
      setMessage({ type: "error", text: "Erro ao redefinir senha." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Redefinir Senha</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Redefinindo..." : "Redefinir"}
        </button>
      </form>
      {message.text && (
        <p style={message.type === "error" ? styles.error : styles.success}>{message.text}</p>
      )}
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
  error: { color: "#d9534f", textAlign: "center", marginTop: "10px" },
  success: { color: "#28a745", textAlign: "center", marginTop: "10px" },
};

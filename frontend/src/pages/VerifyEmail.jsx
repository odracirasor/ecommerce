import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/verify-email/${token}`);
        setStatus("success");
        setMessage(data || "Email verificado com sucesso!");
      } catch {
        setStatus("error");
        setMessage("Token inválido ou expirado.");
      }
    };
    verify();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Verificação de Email</h2>
      {status === "loading" && <p>Verificando email...</p>}
      {status !== "loading" && <p style={status === "success" ? styles.success : styles.error}>{message}</p>}
      {status === "success" && (
        <Link to="/login" style={styles.link}>Ir para Login</Link>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "40px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif", textAlign: "center" },
  title: { marginBottom: "20px" },
  success: { color: "#28a745", fontWeight: "bold" },
  error: { color: "#d9534f", fontWeight: "bold" },
  link: { display: "inline-block", marginTop: "20px", color: "#007bff", textDecoration: "none" },
};

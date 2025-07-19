import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [message, setMessage] = useState("Verificando...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    fetch(`http://localhost:5000/api/auth/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage("✅ Conta verificada com sucesso! Redirecionando...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setMessage("❌ Erro ao verificar conta.");
        }
      });
  }, []);

  return <div className="text-center p-4">{message}</div>;
};

export default Verify;

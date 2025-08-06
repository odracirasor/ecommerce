// pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verificando...");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/verify/${token}`)

      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        setMessage(err.response?.data?.error || "Erro na verificação");
      });
  }, [token]);

  return (
    <div className="text-center mt-10 text-xl">
      {message}
    </div>
  );
};

export default VerifyEmail;

import { useState } from "react";

export default function AdminApproveStorePage() {
  const [storeId, setStoreId] = useState("");
  const [message, setMessage] = useState("");

  async function handleApprove() {
    try {
      const token = localStorage.getItem("token"); // token do admin
      const res = await fetch(`/api/stores/approve/${storeId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao aprovar");
      setMessage("Loja aprovada com sucesso!");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Aprovar Loja</h1>
      <input placeholder="ID da loja" value={storeId} onChange={(e) => setStoreId(e.target.value)} />
      <button onClick={handleApprove}>Aprovar</button>
      {message && <p>{message}</p>}
    </div>
  );
}

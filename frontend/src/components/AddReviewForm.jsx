import { useState } from "react";

export default function AddReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        onReviewAdded(data.review);
        setComment("");
      } else {
        alert(data.message || "Erro ao adicionar avaliação");
      }
    } catch (err) {
      alert("Erro de rede");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r} ⭐</option>
        ))}
      </select>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentário" />
      <button type="submit">Enviar Avaliação</button>
    </form>
  );
}

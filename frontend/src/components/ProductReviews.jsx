import React from "react";

const ProductReviews = ({
  reviews,
  averageRating,
  newComment,
  newRating,
  username,
  setUsername,
  setNewRating,
  setNewComment,
  handleReviewSubmit,
}) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">Avaliações</h3>
    <p className="text-yellow-600 font-bold mb-2">
      Média: {averageRating} / 5 {"★".repeat(Math.round(averageRating))}
      {"☆".repeat(5 - Math.round(averageRating))}
    </p>
    {reviews.length > 0 ? (
      reviews.map((r, i) => (
        <div key={i} className="border-t pt-4 mt-4">
          <p className="font-medium">{r.username}</p>
          <p className="text-yellow-500 mb-1">
            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
          </p>
          <p className="text-gray-700">{r.comment}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-500">Nenhuma avaliação ainda.</p>
    )}

    <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3">
      <input
        type="text"
        value={username}
        placeholder="Seu nome"
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="Escreva sua avaliação..."
        required
      />
      <select
        value={newRating}
        onChange={(e) => setNewRating(Number(e.target.value))}
        className="w-full border px-3 py-2 rounded"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} estrela{r > 1 && "s"}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Enviar Avaliação
      </button>
    </form>
  </div>
);

export default ProductReviews;

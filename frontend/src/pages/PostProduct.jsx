// ProductPost.jsx
import React, { useState } from "react";

const provincias = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando-Cubango", "Cuanza Norte",
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte",
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

const ProductPost = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3) {
      alert("Você deve selecionar pelo menos 3 imagens.");
      return;
    }
    setImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        if (videoElement.duration > 10) {
          alert("O vídeo não pode ter mais de 10 segundos.");
        } else {
          setVideo(file);
          setVideoPreview(videoUrl);
        }
      };
      videoElement.src = videoUrl;
    }
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setPrice(Number(raw).toLocaleString("pt-AO"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      alert("Por favor selecione uma província.");
      return;
    }
    // Enviar dados ao backend (FormData etc.)
    alert("Produto enviado com sucesso!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Postar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Preço"
          className="w-full border p-2 rounded"
          value={price}
          onChange={handlePriceChange}
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        >
          <option value="">Selecione a província</option>
          {provincias.map((prov) => (
            <option key={prov} value={prov}>{prov}</option>
          ))}
        </select>

        <div>
          <label>Imagens (mínimo 3):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
          />
          <div className="flex gap-2 mt-2">
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} className="h-24 rounded shadow" />
            ))}
          </div>
        </div>

        <div>
          <label>Vídeo (máx. 10 segundos):</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
          {videoPreview && (
            <video controls className="mt-2 h-40">
              <source src={videoPreview} type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Enviar Produto
        </button>
      </form>
    </div>
  );
};

export default ProductPost;

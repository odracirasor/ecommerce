import { useState } from "react";

export default function CreateProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "O nome é obrigatório.";
        break;
      case "price":
        if (!value || parseFloat(value.replace(/,/g, "")) <= 0)
          error = "Preço inválido.";
        break;
      case "stock":
        if (value < 0) error = "Estoque não pode ser negativo.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "price") {
      // Remove tudo que não é número e formata com vírgulas
      value = value.replace(/[^\d]/g, "");
      value = new Intl.NumberFormat("pt-BR").format(Number(value || 0));
    }
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    if (newImages.length > 5) {
      setMessage("Você pode adicionar no máximo 5 imagens.");
      return;
    }
    setImages(newImages);
    const previews = newImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const isValid =
      Object.keys(form).every((key) => validateField(key, form[key])) &&
      images.length >= 3;
    if (!isValid) {
      setMessage("Preencha todos os campos corretamente e selecione pelo menos 3 imagens.");
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key].replace(/\./g, "").replace(/,/g, ""));
    }
    images.forEach((image) => formData.append("images", image));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Produto criado com sucesso!");
        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          brand: "",
          stock: "",
        });
        setImages([]);
        setPreviewUrls([]);
      } else {
        setMessage(data.message || "Erro ao criar produto.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erro ao criar produto.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Criar Produto</h1>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}

        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <input
          type="text"
          name="price"
          placeholder="Preço (Ex: 1.000)"
          value={form.price}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.price && <span style={styles.error}>{errors.price}</span>}

        <input
          type="text"
          name="category"
          placeholder="Categoria"
          value={form.category}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={form.brand}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="stock"
          placeholder="Estoque"
          value={form.stock}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.stock && <span style={styles.error}>{errors.stock}</span>}

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
          style={styles.fileInput}
        />
        <div style={styles.previewContainer}>
          {previewUrls.map((url, index) => (
            <div key={index} style={styles.previewBox}>
              <img src={url} alt="preview" style={styles.previewImage} />
              <button
                type="button"
                style={styles.removeButton}
                onClick={() => removeImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button type="submit" style={styles.submitButton}>
          Criar Produto
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" },
  title: { fontSize: "24px", marginBottom: "20px" },
  message: { marginBottom: "10px", color: "green" },
  error: { color: "red", fontSize: "12px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  textarea: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "80px" },
  fileInput: { marginTop: "10px" },
  previewContainer: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" },
  previewBox: { position: "relative", width: "100px", height: "100px" },
  previewImage: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", transition: "0.3s" },
  removeButton: {
    position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.6)",
    color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", width: "20px", height: "20px"
  },
  submitButton: { padding: "12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
};

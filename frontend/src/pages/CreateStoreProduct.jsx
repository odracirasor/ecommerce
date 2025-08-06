import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateStoreProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    images.forEach((img) => formData.append("images", img));

    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/store-products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    navigate("/store/my-products");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Product Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-semibold">Price (Kz)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 font-semibold">Stock</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1 font-semibold">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
          {images.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = e => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Name, category, and price are required.");
      return;
    }

    const newItem = {
      ...newProduct,
      _id: crypto.randomUUID(),
      price: parseFloat(newProduct.price),
    };

    setProducts(prev => [...prev, newItem]);

    // Clear form
    setNewProduct({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Products</h1>

      {/* Formulário */}
      <form onSubmit={handleAddProduct} className="space-y-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={newProduct.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>

      {/* Lista de produtos adicionados */}
      <h2 className="text-xl font-bold mb-2">Current Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p._id} className="border p-4 rounded shadow">
            {p.image && (
              <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2" />
            )}
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.category}</p>
            <p className="text-sm">{p.description}</p>
            <p className="text-blue-600 font-bold">${p.price.toFixed(2)}</p>
          </div>
        ))}
        {products.length === 0 && <p>No products yet.</p>}
      </div>
    </div>
  );
};

export default AdminProducts;

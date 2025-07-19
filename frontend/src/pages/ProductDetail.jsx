import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Produto não encontrado.");
        const data = await res.json();
        setProduct(data);
        setEditedProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleEditChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
      });
      if (!res.ok) throw new Error("Erro ao atualizar o produto.");
      const updated = await res.json();
      setProduct(updated);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tens certeza que queres eliminar este produto?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao eliminar o produto.");
      alert("Produto eliminado com sucesso.");
      navigate("/"); // or navigate to /produtos
    } catch (err) {
      alert(err.message);
    }
  };

  const canEdit =
    currentUser &&
    (currentUser.id === product?.authorId || currentUser.role === "admin");

  if (loading) return <div className="p-4">🔄 Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">❌ {error}</div>;
  if (!product) return null;

  const itemInCart = cart.find((p) => p._id === product._id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  const isOutOfStock =
    product.stock !== undefined && quantityInCart >= product.stock;

  const handleMessageSeller = () => {
    navigate(`/messages/${encodeURIComponent(product.author)}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />

        <div>
          {isEditing ? (
            <>
              <input
                name="name"
                value={editedProduct.name}
                onChange={handleEditChange}
                className="text-2xl font-bold w-full mb-2 border px-2 py-1"
              />
              <input
                name="category"
                value={editedProduct.category}
                onChange={handleEditChange}
                className="text-gray-500 mb-2 w-full border px-2 py-1"
              />
              <input
                name="price"
                type="number"
                value={editedProduct.price}
                onChange={handleEditChange}
                className="text-red-600 font-semibold text-xl mb-2 w-full border px-2 py-1"
              />
              <textarea
                name="description"
                value={editedProduct.description}
                onChange={handleEditChange}
                className="w-full mb-6 border px-2 py-2"
              />
              <input
                name="stock"
                type="number"
                value={editedProduct.stock}
                onChange={handleEditChange}
                className="w-full mb-2 border px-2 py-1"
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-2">{product.category}</p>
              <p className="text-red-600 font-semibold text-xl mb-2">
                {product.price.toLocaleString("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                  minimumFractionDigits: 0,
                })}
              </p>
              {product.stock !== undefined && (
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Estoque disponível:</strong> {product.stock}
                </p>
              )}
              <p className="mb-6">{product.description}</p>
            </>
          )}

          <p className="text-sm text-gray-600 mb-1">
            <strong>Publicado por:</strong> {product.author}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Data:</strong>{" "}
            {new Date(product.postedAt).toLocaleDateString("pt-AO")}
          </p>

          <div className="flex gap-4 flex-wrap">
            {!isEditing && (
              <button
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                className={`px-6 py-2 rounded text-white ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isOutOfStock ? "Estoque Esgotado" : "Adicionar ao Carrinho"}
              </button>
            )}

            <button
              onClick={handleMessageSeller}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Enviar Mensagem
            </button>

            {canEdit && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleEditSave}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Editar Produto
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Eliminar Produto
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

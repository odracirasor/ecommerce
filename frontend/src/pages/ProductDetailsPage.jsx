import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import AddReviewForm from "../components/AddReviewForm";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("descricao");
  const [addingToCart, setAddingToCart] = useState(false);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao carregar produto");
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
        setSelectedImage(data.product.images?.[0]?.url || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchReviews() {
      try {
        const res = await fetch(`/api/products/${id}/reviews`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao carregar avaliações");
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchProduct();
    fetchReviews();
    checkIfInWishlist();
  }, [id]);

  async function checkIfInWishlist() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.products)) {
        setWishlist(data.products.some((p) => p._id === id));
      }
    } catch (err) {
      console.error("Erro ao verificar wishlist:", err.message);
    }
  }

  async function handleAddToCart() {
    if (!product) return;
    setAddingToCart(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao adicionar ao carrinho");
      alert("Produto adicionado ao carrinho!");
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleWishlist() {
    if (!product) return;
    setUpdatingWishlist(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Você precisa estar logado.");
      if (!wishlist) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao adicionar à wishlist");
        setWishlist(true);
        alert("Adicionado à wishlist!");
      } else {
        const res = await fetch(`/api/wishlist/${product._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao remover da wishlist");
        setWishlist(false);
        alert("Removido da wishlist!");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingWishlist(false);
    }
  }

  function handleBuyNow() {
    alert(`Compra imediata de ${quantity}x ${product.name}`);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link do produto copiado!");
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-300 w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-300 w-1/4"></div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;
  if (!product) return <div className="p-6 text-center">Produto não encontrado.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">Home</Link> &gt;{" "}
        <Link to={`/category/${product.category}`} className="hover:underline">{product.category}</Link> &gt;{" "}
        <span className="text-gray-800">{product.name}</span>
      </nav>

      {/* Product section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div>
          <img
            src={selectedImage || "/placeholder.png"}
            alt={product.name}
            className="w-full rounded-lg shadow-md object-cover mb-4"
          />
          <div className="flex space-x-2">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`thumbnail-${index}`}
                className={`w-16 h-16 rounded cursor-pointer border ${selectedImage === img.url ? "border-blue-500" : "border-gray-300"}`}
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <button
              onClick={handleWishlist}
              disabled={updatingWishlist}
              className={`p-2 rounded-full border ${wishlist ? "bg-red-500 text-white" : "bg-white"}`}
              title={wishlist ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            >
              {wishlist ? "♥" : "♡"}
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-500 text-xl">★</span>
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-gray-500">({reviews.length} avaliações)</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-4">{product.price} KZ</p>

          {/* Stock status */}
          <p className={`mb-4 font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? "Em estoque" : "Fora de estoque"}
          </p>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="quantity" className="font-medium">Quantidade:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 border rounded p-1 text-center"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {addingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Comprar Agora
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Compartilhar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("descricao")}
            className={`px-4 py-2 ${activeTab === "descricao" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
          >
            Descrição
          </button>
          <button
            onClick={() => setActiveTab("especificacoes")}
            className={`px-4 py-2 ${activeTab === "especificacoes" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
          >
            Especificações
          </button>
          <button
            onClick={() => setActiveTab("avaliacoes")}
            className={`px-4 py-2 ${activeTab === "avaliacoes" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
          >
            Avaliações
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "descricao" && (
            <div>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
          {activeTab === "especificacoes" && (
            <table className="w-full text-left border">
              <tbody>
                <tr className="border-b"><td className="p-2 font-semibold">Peso</td><td className="p-2">{product.specs?.weight || "N/A"}</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Dimensões</td><td className="p-2">{product.specs?.dimensions || "N/A"}</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Material</td><td className="p-2">{product.specs?.material || "N/A"}</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Cor</td><td className="p-2">{product.specs?.color || "N/A"}</td></tr>
              </tbody>
            </table>
          )}
          {activeTab === "avaliacoes" && (
            <div>
              {loadingReviews ? (
                <p>Carregando avaliações...</p>
              ) : reviews.length === 0 ? (
                <p>Nenhuma avaliação encontrada.</p>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r._id} className="border-b pb-3">
                      <p className="font-semibold">
                        {r.user?.username || "Usuário"} - {r.rating} ⭐
                      </p>
                      <p className="text-gray-700">{r.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="text-xl font-semibold mt-6 mb-3">Adicionar Avaliação</h3>
              <AddReviewForm
                productId={product._id}
                onReviewAdded={(newReview) => setReviews((prev) => [newReview, ...prev])}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Produtos Relacionados</h2>
        {relatedProducts.length === 0 ? (
          <p>Nenhum produto relacionado.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p._id}
                to={`/products/${p._id}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={p.images?.[0]?.url || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-semibold truncate">{p.name}</h4>
                  <p className="font-bold text-green-600">{p.price} KZ</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

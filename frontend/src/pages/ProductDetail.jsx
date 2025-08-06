import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductSpecifications from "../components/ProductSpecifications";
import ProductReviews from "../components/ProductReviews";
import RelatedProducts from "../components/RelatedProducts";
import BestSellingProducts from "../components/BestSellingProducts";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [username, setUsername] = useState("");

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || data.video || "");
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!username || !newComment) return;
    const newReview = { username, rating: newRating, comment: newComment };
    setReviews([newReview, ...reviews]);
    setNewComment("");
    setNewRating(5);
    setUsername("");
  };

  if (!product) return <div className="p-6">Carregando produto...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductGallery
          images={product.images}
          mainImage={mainImage}
          setMainImage={setMainImage}
          video={product.video}
        />
        <ProductInfo product={product} formatDate={formatDate} />
      </div>

      <div className="mt-10 bg-white p-6 rounded shadow">
        <ProductSpecifications product={product} />
        <ProductReviews
          reviews={reviews}
          averageRating={averageRating}
          newComment={newComment}
          newRating={newRating}
          username={username}
          setUsername={setUsername}
          setNewRating={setNewRating}
          setNewComment={setNewComment}
          handleReviewSubmit={handleReviewSubmit}
        />
      </div>

      <RelatedProducts products={[]} />
      <BestSellingProducts products={[]} />
    </div>
  );
};

export default ProductDetail;

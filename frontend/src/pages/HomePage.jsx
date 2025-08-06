import { useEffect, useState } from "react";
import axios from "axios";
import ProductsList from "../components/ProductsList";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/products/featured"),
          axios.get("/api/categories"),
        ]);
        setProducts(res1.data.products || []);
        setFeatured(res2.data.products || []);
        setCategories(res3.data.categories || []);
      } catch (err) {
        console.error("❌ HomePage fetch error:", err.message);
      }
    };

    fetchAll();
  }, []);

  return (
    <>
      <div className="bg-white min-h-screen pt-6">
        <HeroSection />

        {/* 📦 Categorias */}
        <section className="max-w-6xl mx-auto px-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Categorias</h2>

          <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 pb-2">
            {categories.map((cat) => (
              <Link
                to={`/category/${cat._id}`}
                key={cat._id}
                className="min-w-[100px] flex-shrink-0 text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden shadow hover:scale-105 transition-transform duration-200 bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ⭐ Produtos em Destaque */}
        <ProductsList products={featured} title="Produtos em Destaque" />

        {/* 🛒 Todos os Produtos */}
        <ProductsList products={products} title="Todos os Produtos" />
      </div>

      <Footer />
    </>
  );
};

export default HomePage;

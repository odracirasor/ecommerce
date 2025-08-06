import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-100 via-white to-purple-100 py-12 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Compra Agora na <span className="text-purple-600">BUÉ</span>
        </h1>
        <p className="text-lg text-gray-600">
          Os melhores produtos com os melhores preços. Encontre tudo o que precisa em um só lugar!
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
        >
          Ver Produtos
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

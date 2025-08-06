import React from "react";
import bannerImage from "../assets/banner.jpg"; // Altere o caminho se necessário
import { FaShoppingBag } from "react-icons/fa";

const Banner = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white py-12 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between rounded-3xl shadow-xl overflow-hidden mb-8 animate-fade-in">
      {/* Texto */}
      <div className="space-y-4 max-w-xl">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          <span className="text-yellow-300">O teu desejo</span> é a nossa preocupação
        </h2>
        <p className="text-lg md:text-xl font-medium text-gray-100">
          Produtos de <span className="text-yellow-200 font-semibold">qualidade</span> ao teu alcance!
        </p>
        <button className="mt-4 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-5 py-2 rounded-full shadow-lg transition duration-200">
          <FaShoppingBag />
          Comprar Agora
        </button>
      </div>

      {/* Imagem com efeito */}
      <div className="mt-6 md:mt-0 md:ml-10">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Animação opcional */}
      <div className="absolute top-0 left-0 w-full h-full rounded-3xl pointer-events-none bg-white opacity-[0.02] mix-blend-overlay animate-pulse" />
    </div>
  );
};

export default Banner;

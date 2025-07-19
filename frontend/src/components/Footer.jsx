import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-8 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
        <div>
          <h4 className="font-bold mb-2">Comprar</h4>
          <ul className="space-y-1">
            <li>Ajuda</li>
            <li>Ofertas</li>
            <li>Lojas</li>
            <li>Cartões Presente</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Vender</h4>
          <ul className="space-y-1">
            <li>Como vender</li>
            <li>Taxas</li>
            <li>Regras</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Empresa</h4>
          <ul className="space-y-1">
            <li>Sobre</li>
            <li>Carreiras</li>
            <li>Políticas</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Ajuda</h4>
          <ul className="space-y-1">
            <li>Centro de Suporte</li>
            <li>Contato</li>
            <li>Devoluções</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Conecte-se</h4>
          <ul className="space-y-1">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Ecommerce Angola. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;

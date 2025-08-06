import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-8 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
        <div>
          <h4 className="font-bold mb-2">Comprar</h4>
          <ul className="space-y-1">
            <li><Link to="/ajuda">Ajuda</Link></li>
            <li><Link to="/ofertas">Ofertas</Link></li>
            <li><Link to="/lojas">Lojas</Link></li>
            <li><Link to="/cartoes-presente">Cartões Presente</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Vender</h4>
          <ul className="space-y-1">
            <li><Link to="/como-vender">Como vender</Link></li>
            <li><Link to="/taxas">Taxas</Link></li>
            <li><Link to="/regras">Regras</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Empresa</h4>
          <ul className="space-y-1">
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/politicas">Políticas</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Ajuda</h4>
          <ul className="space-y-1">
            <li><Link to="/contato">Contato</Link></li>
            <li><Link to="/reembolso">Política de Reembolso</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Conecte-se</h4>
          <ul className="space-y-1">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} BUÉ Angola. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;

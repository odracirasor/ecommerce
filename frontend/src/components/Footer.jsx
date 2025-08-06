const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-8 md:flex md:items-center md:justify-between text-sm">
        <p className="text-center md:text-left mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} <strong>BUE Store</strong>. Todos os direitos reservados.
        </p>

        <nav className="flex justify-center md:justify-end gap-6">
          <a href="/about" className="hover:text-black transition-colors duration-200">Sobre</a>
          <a href="/contact" className="hover:text-black transition-colors duration-200">Contato</a>
          <a href="/privacy" className="hover:text-black transition-colors duration-200">Privacidade</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

import { Search, ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
      {/* Logo */}
      <div className="text-2xl font-bold text-black">BUE</div>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl mx-4 hidden md:flex">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Cart Icon */}
      <div className="flex items-center gap-4">
        <ShoppingCart className="text-gray-700 hover:text-black cursor-pointer" />
      </div>
    </header>
  );
}

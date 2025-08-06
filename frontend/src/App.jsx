import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Footer from "./components/Footer";
import Banner from "./components/Banner";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import Message from "./pages/Message";
import PostProduct from "./pages/PostProduct";
import Settings from "./pages/Settings";
import Payment from "./pages/Payment";
import PaymentTest from "./pages/PaymentTest";
import Compras from "./pages/Compras";
import Vendas from "./pages/Vendas";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers1";
import Produtos from "./pages/Produtos";
import EditProduc from "./pages/EditProduc";
import Balance from "./pages/Balance";
import Withdraw from "./pages/Withdraw";
import VerifyEmail from "./pages/VerifyEmail";
import NewProduct from "./pages/NewProduct";
import SearchResults from "./pages/SearchResults";
import { FaSearch } from "react-icons/fa";
import Inbox from "./pages/Inbox"; // ajuste o caminho se necessário



import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// --------------------- NAVBAR COMPONENT ---------------------
const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(search)}&filter=${filter}`);
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex flex-wrap items-center gap-4">
      <Link to="/" className="hover:underline">Catálogo</Link>
      <Link to="/cart" className="hover:underline">Carrinho</Link>
      <Link to="/about" className="hover:underline">Sobre</Link>
      <Link to="/contact" className="hover:underline">Contacto</Link>

      {/* Centralized Amazon-style Search Bar */}
      <div className="flex justify-center flex-1">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-4xl rounded-md overflow-hidden shadow-sm border border-gray-300 bg-white"
        >
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-100 text-black text-sm px-3 py-2 border-r border-gray-300 outline-none"
          >
            <option value="all">Todos</option>
            <option value="electronics">Eletrônicos</option>
            <option value="clothes">Roupas</option>
            <option value="sports">Esportes</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisa na BUÉ "
            className="flex-grow text-sm px-4 py-2 text-black focus:outline-none"
          />

          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 text-black text-sm flex items-center justify-center"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* User Links */}
      {currentUser && (
        <>
          <Link to={`/profile/${currentUser._id}`} className="hover:underline">Perfil</Link>
          <Link to="/compras" className="hover:underline">Compras</Link>
          <Link to="/vendas" className="hover:underline">Vendas</Link>
          <Link to="/produtos" className="hover:underline">Meus Produtos</Link>
          <Link to="/checkout" className="hover:underline">Checkout</Link>
          <Link to="/settings" className="hover:underline">Configurações</Link>
          <Link to="/balance" className="hover:underline">Saldo</Link>
          <Link to="/withdraw" className="hover:underline">Sacar</Link>
        </>
      )}

      {/* Admin Links */}
      {currentUser?.isAdmin && (
        <>
          <Link to="/admin/products" className="hover:underline">Admin Produtos</Link>
          <Link to="/admin/orders" className="hover:underline">Admin Ordens</Link>
          <Link to="/admin/dashboard" className="hover:underline">Painel Admin</Link>
          <Link to="/admin/users1" className="hover:underline">Usuários</Link>
        </>
      )}

      {/* Auth Buttons */}
      <div className="ml-auto flex gap-4 items-center">
        {currentUser ? (
          <>
            <span className="text-sm text-gray-300">Olá, {currentUser.name}</span>
            <button onClick={() => { logout(); navigate("/"); }} className="hover:underline text-red-300">Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Registar</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// --------------------- MAIN WRAPPER ---------------------
function AppWrapper() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {location.pathname === "/" && <Banner />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/mensagens/:id" element={<Message />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-test" element={<PaymentTest />} />
          <Route path="/edit-product/:id" element={<EditProduc />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/mensagens" element={<Inbox />} />
          {/* Protected Routes */}
          <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/post-product" element={<ProtectedRoute><PostProduct /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
          <Route path="/vendas" element={<ProtectedRoute><Vendas /></ProtectedRoute>} />
          <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
          <Route path="/balance" element={<ProtectedRoute><Balance /></ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users1" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute><NewProduct /></ProtectedRoute>} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/profile/:id/Inbox" element={<Inbox />} />
          <Route path="/inbox" element={<Inbox />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

// --------------------- APP EXPORT ---------------------
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppWrapper />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

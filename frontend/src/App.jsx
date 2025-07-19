import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Footer from "./components/Footer";
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
import AdminUsers from './pages/AdminUsers1';
import Produtos from './pages/Produtos';
import EditProduc from './pages/EditProduc'; // ✅ Arquivo correto
import Balance from './pages/Balance';
import Withdraw from './pages/Balance';


import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex gap-4 items-center">
      <Link to="/" className="hover:underline">Catálogo</Link>
      <Link to="/cart" className="hover:underline">Carrinho</Link>
      <Link to="/about" className="hover:underline">Sobre</Link>
      <Link to="/contact" className="hover:underline">Contacto</Link>

      {currentUser && (
        <>
          <Link to="/profile" className="hover:underline">Perfil</Link>
          <Link to="/compras" className="hover:underline">Compras</Link>
          <Link to="/vendas" className="hover:underline">Vendas</Link>
          <Link to="/produtos" className="hover:underline">Meus Produtos</Link>
          <Link to="/checkout" className="hover:underline">Checkout</Link>
          <Link to="/settings" className="hover:underline">Configurações</Link>
          <Link to="/balance" className="hover:underline">Saldo</Link>
          <Link to="/withdraw" className="hover:underline">Sacar</Link>
        </>
      )}

      {currentUser?.isAdmin && (
        <>
          <Link to="/admin/products" className="hover:underline">Admin Produtos</Link>
          <Link to="/admin/orders" className="hover:underline">Admin Ordens</Link>
          <Link to="/admin/dashboard" className="hover:underline">Painel Admin</Link>
          <Link to="/admin/users1" className="hover:underline">Usuários</Link>
        </>
      )}

      <div className="ml-auto flex gap-4 items-center">
        {currentUser ? (
          <>
            <span className="text-sm text-gray-300">Olá, {currentUser.name}</span>
            <button
              onClick={logout}
              className="hover:underline text-red-300"
            >
              Sair
            </button>
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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
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
                <Route path="/messages/:sellerId" element={<Message />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-test" element={<PaymentTest />} />
                <Route path="/edit-product/:id" element={<EditProduc />} />

                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/post-product" element={<ProtectedRoute><PostProduct /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
                <Route path="/vendas" element={<ProtectedRoute><Vendas /></ProtectedRoute>} />
                <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />

                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users1" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                <Route path="/balance" element={<ProtectedRoute><Balance /></ProtectedRoute>} />
                <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />


                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

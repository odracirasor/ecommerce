import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import UpdateProductPage from "./pages/UpdateProductPage";

// Auth & User
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Categories
import CategoriesListPage from "./pages/CategoriesListPage";
import CategoryDetailsPage from "./pages/CategoryDetailsPage";
import AdminCreateCategoryPage from "./pages/AdminCreateCategoryPage";
import AdminEditCategoryPage from "./pages/AdminEditCategoryPage";

// Products
import CreateProductPage from "./pages/createProductPage";
import MyProductsPage from "./pages/myProductsPage";

// Orders
import CreateOrderPage from "./pages/CreateOrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import UpdateOrderStatusPage from "./pages/UpdateOrderStatusPage";

// Messages
import InboxPage from "./pages/InboxPage";
import MessagesPage from "./pages/MessagesPage";

// Stores
import StoreRegisterPage from "./pages/StoreRegisterPage";
import StoreLoginPage from "./pages/StoreLoginPage";
import StoreProfilePage from "./pages/StoreProfilePage";
import AdminApproveStorePage from "./pages/AdminApproveStorePage";
import MyStoreProducts from "./pages/MyStoreProducts";
import CreateStoreProduct from "./pages/CreateStoreProduct";


import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminSuspendedUsers from "./pages/AdminSuspendedUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminStores from "./pages/AdminStores";
import AdminStats from "./pages/AdminStats";

import SearchResultsPage from "./pages/SearchResultsPage";

import CartPage from "./pages/CartPage";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Auth & User */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Products */}
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/products/my" element={<MyProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/products/:id/edit" element={<UpdateProductPage />} />

        {/* Categories */}
        <Route path="/categories" element={<CategoriesListPage />} />
        <Route path="/categories/:id" element={<CategoryDetailsPage />} />
        <Route path="/admin/categories/create" element={<AdminCreateCategoryPage />} />
        <Route path="/admin/categories/:id/edit" element={<AdminEditCategoryPage />} />

        {/* Orders */}
        <Route path="/orders/create" element={<CreateOrderPage />} />
        <Route path="/orders/my" element={<MyOrdersPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/admin/orders/:id/status" element={<UpdateOrderStatusPage />} />

        {/* Stores */}
        <Route path="/store/register" element={<StoreRegisterPage />} />
        <Route path="/store/login" element={<StoreLoginPage />} />
        <Route path="/store/profile" element={<StoreProfilePage />} />
        <Route path="/admin/store/approve" element={<AdminApproveStorePage />} />
        <Route path="/store/my-products" element={<MyStoreProducts />} />
        <Route path="/store/create-product" element={<CreateStoreProduct />} />

       
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/suspended" element={<AdminSuspendedUsers />} />
        <Route path="/admin/users/:id" element={<AdminUserDetails />} />
        <Route path="/admin/stores" element={<AdminStores />} />
        <Route path="/admin/stats" element={<AdminStats />} />

        <Route path="/search" element={<SearchResultsPage />} />

        {/* Messages */}
        <Route path="/messages/inbox" element={<InboxPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

import { Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import Orders from "./components/Orders";
import OrderSuccess from "./components/OrderSucess";
import Wishlist from "./components/Wishlist";
import Cart from "./components/Cart";
import Profile from "./components/Profile";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/order-success"
        element={<OrderSuccess />}
      />

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App;
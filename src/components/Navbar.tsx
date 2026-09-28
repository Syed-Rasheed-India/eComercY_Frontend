import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Heart,
  ShoppingCart
} from "lucide-react";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  // Search products
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");

    if (location.pathname === "/products") {
      navigate("/products");
    }
  };

  return (
    <header className="navbar">

      <div className="navbar-inner">

        {/* Logo */}
        <Link
          to="/home"
          className="navbar-logo"
        >
          eComercY
        </Link>


        {/* Navigation */}
        <nav className="navbar-links">

          <Link
            to="/home"
            className={
              location.pathname === "/home"
                ? "active"
                : ""
            }
          >
            Home
          </Link>


          <Link
            to="/products"
            className={
              location.pathname === "/products"
                ? "active"
                : ""
            }
          >
            Products
          </Link>


          <Link
            to="/products"
            className={
              location.pathname === "/products"
                ? "active"
                : ""
            }
          >
            Categories
          </Link>


          <Link
            to="/orders"
            className={
              location.pathname === "/orders"
                ? "active"
                : ""
            }
          >
            Orders
          </Link>


          <Link
            to="/admin"
            className={
              location.pathname === "/admin"
                ? "active"
                : ""
            }
          >
            Admin
          </Link>

        </nav>


        {/* Search */}
        <form
          className="navbar-search"
          onSubmit={handleSearch}
        >

          <Search size={17} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="navbar-search-clear"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </form>


        {/* Wishlist & Cart */}
        <div className="navbar-actions">

          {/* Wishlist */}
          <button
            type="button"
            className="navbar-icon"
            onClick={() =>
              navigate("/wishlist")
            }
            aria-label="Wishlist"
          >
            <Heart size={19} />
          </button>


          {/* Cart */}
          <button
            type="button"
            className="navbar-icon"
            onClick={() =>
              navigate("/cart")
            }
            aria-label="Cart"
          >
            <ShoppingCart size={19} />
          </button>

        </div>

      </div>

    </header>
  );
};

export default Navbar;
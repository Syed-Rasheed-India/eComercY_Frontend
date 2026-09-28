
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Truck,
  CheckCircle2,
} from "lucide-react";
import "../styles/H_main.css";
import { NavLink,Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const H_main = () => {

  const navigate = useNavigate();
    
  return (
    <div className="home-page">
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">

          {/* Logo */}
          {/* <div className="logo">
            eComercY
          </div> */}
          <Link
          to="/home"
          className="navbar-logo"
        >
          eComercY
        </Link>

          {/* Navigation */}
          <nav className="nav-links">
            <a href="#" className="active">
              Home
            </a>
           <NavLink
              to="/products"
              className="nav-link"
            >
              Products
            </NavLink>
            <a href="#">Categories</a>
            <a href="#">Orders</a>
            <a href="#">Admin</a>
          </nav>

          {/* Search */}
          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search products, categories..."
            />
          </div>

          {/* Right Icons */}
          <div className="nav-actions">

            <div
  className="nav-icon"
  onClick={() => navigate("/wishlist")}
>
  <Heart size={18} />
</div>

<div
  className="nav-icon"
  onClick={() => navigate("/cart")}
>
  <ShoppingCart size={18} />
</div>

            <button
  type="button"
  className="profile-icon"
  onClick={() => navigate("/profile")}
>
  <User size={15} />
</button>

          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="hero">

        {/* Left Content */}
        <section className="hero-content">

          <div className="collection-label">
            <CheckCircle2 size={12} />
            <span>Curated Lifestyle Collection</span>
          </div>

          <h1>
            Find what you need.{" "}
            <span>Shop with ease.</span>
          </h1>

          <p className="hero-description">
            Simple shopping. Better experience. Discover high quality curated
            items tailored for your lifestyle with lightning-fast delivery and
            seamless returns.
          </p>

          {/* Buttons */}
          <div className="hero-buttons">

  <button
    className="shop-btn"
    onClick={() => navigate("/products")}
  >
    Shop Now
    <span>→</span>
  </button>

  <button
    className="explore-btn"
    onClick={() => navigate("/products")}
  >
    Explore Products
  </button>

</div>

          {/* Stats */}
          <div className="stats">

            <div className="stat">
              <strong>50k+</strong>
              <span>Active Buyers</span>
            </div>

            <div className="stat">
              <strong>99.8%</strong>
              <span>Satisfaction</span>
            </div>

            <div className="stat">
              <strong>24/7</strong>
              <span>Support</span>
            </div>

          </div>

        </section>

        {/* ================= HERO IMAGE ================= */}
        <section className="hero-visual">

          {/* Back decorative cards */}
          <div className="image-decoration decoration-one"></div>
          <div className="image-decoration decoration-two"></div>

          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85"
              alt="Lifestyle workspace"
            />
          </div>

          {/* Delivery Badge */}
          <div className="delivery-card">

            <div className="delivery-icon">
              <Truck size={17} />
            </div>

            <div className="delivery-text">
              <strong>Free Express Delivery</strong>
              <span>On orders over $50</span>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
};

export default H_main;
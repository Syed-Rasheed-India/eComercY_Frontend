import { useEffect, useState } from "react";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import "../styles/Wishlist.css";

const API_URL = "http://localhost:3000";

interface Product {
  _id: string;
  name: string;
  images?: string[];
  actualPrice: number;
  originalPrice: number;
  rating: number;
  stock: number;
}

function Wishlist() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      setProducts(data.wishlist || []);

    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const removeFromWishlist = async (
    productId: string
  ) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prev) =>
          prev.filter(
            (product) =>
              product._id !== productId
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (
    productId: string
  ) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/cart/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Added to cart");

    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="wishlist-page">
          <p>Loading wishlist...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="wishlist-page">

        <div className="wishlist-header">
          <h1>My Wishlist</h1>

          <p>
            {products.length} item
            {products.length !== 1 ? "s" : ""}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="empty-wishlist">
            <Heart size={45} />

            <h2>Your wishlist is empty</h2>

            <p>
              Save products you love here.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-list">

            {products.map((product) => (

              <div
                className="wishlist-card"
                key={product._id}
              >

                <div
                  className="wishlist-image"
                  onClick={() =>
                    navigate(
                      `/products/${product._id}`
                    )
                  }
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                  />
                </div>

                <div className="wishlist-details">

                  <h2>{product.name}</h2>

                  <p className="wishlist-rating">
                    ★ {product.rating}
                  </p>

                  <div className="wishlist-price">
                    <strong>
                      ${product.actualPrice}
                    </strong>

                    {product.originalPrice >
                      product.actualPrice && (
                      <del>
                        ${product.originalPrice}
                      </del>
                    )}
                  </div>

                  <div className="wishlist-actions">

                    <button
                      onClick={() =>
                        addToCart(product._id)
                      }
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart size={16} />

                      {product.stock <= 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>

                    <button
                      className="remove-wishlist"
                      onClick={() =>
                        removeFromWishlist(
                          product._id
                        )
                      }
                    >
                      <X size={16} />

                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>
    </>
  );
}

export default Wishlist;
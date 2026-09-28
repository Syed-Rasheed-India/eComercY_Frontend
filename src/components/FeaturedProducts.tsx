import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  Ban
} from "lucide-react";

import "../styles/FeaturedProducts.css";

const FeaturedProducts = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // GET FEATURED PRODUCTS
  // Business logic is handled by the backend.
  // =====================================================

  useEffect(() => {

    const getFeaturedProducts = async () => {

      try {

        const response = await fetch(
          "http://localhost:3000/featured"
        );

        // Check whether API request was successful
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        // Convert response into JavaScript object
        const data = await response.json();

        // Store products received from backend
        setProducts(data.products);

      } catch (error) {

        console.error("Featured products error:", error);

        setError("Unable to load products");

      } finally {

        // Stop loading after request finishes
        setLoading(false);

      }

    };

    getFeaturedProducts();

  }, []);


  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {

    return (
      <section className="featured-section">

        <div className="featured-header">

          <div>

            <p className="featured-label">
              HANDPICKED FOR YOU
            </p>

            <h2>
              Featured Products
            </h2>

          </div>

        </div>

        <p>
          Loading products...
        </p>

      </section>
    );

  }


  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {

    return (
      <section className="featured-section">

        <div className="featured-header">

          <div>

            <p className="featured-label">
              HANDPICKED FOR YOU
            </p>

            <h2>
              Featured Products
            </h2>

          </div>

        </div>

        <p>
          {error}
        </p>

      </section>
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <section className="featured-section">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="featured-header">

        <div>

          <p className="featured-label">
            HANDPICKED FOR YOU
          </p>

          <h2>
            Featured Products
          </h2>

        </div>

      </div>


      {/* =================================================
          PRODUCTS
      ================================================= */}

      <div className="products-grid">

        {products.map((product) => {

          // =================================================
          // UI LOGIC ONLY
          //
          // Business logic such as highDemand is already
          // calculated by the backend.
          // =================================================

          const outOfStock =
            product.stock <= 0;


          return (

            <article
              className="product-card"
              key={product._id || product.name}
            >

              {/* =================================================
                  PRODUCT IMAGE
              ================================================= */}

              <div className="product-image-container">

                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />


                {/* =================================================
                    DISCOUNT BADGE
                ================================================= */}

                {product.discountPercentage > 0 &&
                  !outOfStock && (

                  <span className="discount-badge">

                    -{product.discountPercentage}%

                  </span>

                )}


                {/* =================================================
                    OUT OF STOCK
                ================================================= */}

                {outOfStock && (

                  <span className="stock-badge">

                    Out of Stock

                  </span>

                )}


                {/* =================================================
                    BEST SELLING
                    `highDemand` comes from the backend.
                ================================================= */}

                {product.highDemand &&
                  !outOfStock && (

                  <span className="demand-badge">

                    Best Selling

                  </span>

                )}


                {/* =================================================
                    WISHLIST
                ================================================= */}

                <button
                  className={
                    product.wishlist
                      ? "wishlist-btn active"
                      : "wishlist-btn"
                  }
                  type="button"
                >

                  <Heart
                    size={17}
                    fill={
                      product.wishlist
                        ? "currentColor"
                        : "none"
                    }
                  />

                </button>

              </div>


              {/* =================================================
                  PRODUCT INFORMATION
              ================================================= */}

              <div className="product-info">


                {/* =================================================
                    CATEGORY + RATING
                ================================================= */}

                <div className="product-top-row">

                  <span className="product-category">

                    {product.category}

                  </span>


                  <span className="rating">

                    <Star
                      size={10}
                      fill="currentColor"
                    />

                    {product.rating}

                  </span>

                </div>


                {/* =================================================
                    PRODUCT NAME
                ================================================= */}

                <h3>

                  {product.name}

                </h3>


                {/* =================================================
                    PRICE + CART
                ================================================= */}

                <div className="product-bottom">


                  {/* PRICE */}

                  <div className="price-container">

                    <span className="actual-price">

                      $
                      {Number(
                        product.actualPrice
                      ).toFixed(2)}

                    </span>


                    {/* Original price only appears
                        when it is greater than actual price */}

                    {Number(product.originalPrice) >
                      Number(product.actualPrice) && (

                      <span className="original-price">

                        $
                        {Number(
                          product.originalPrice
                        ).toFixed(2)}

                      </span>

                    )}

                  </div>


                  {/* =================================================
                      CART BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    className={
                      outOfStock
                        ? "cart-btn disabled"
                        : "cart-btn"
                    }
                    disabled={outOfStock}
                  >

                    {outOfStock ? (

                      <Ban size={16} />

                    ) : (

                      <ShoppingCart size={16} />

                    )}

                  </button>

                </div>

              </div>

            </article>

          );

        })}

      </div>

    </section>

  );

};


export default FeaturedProducts;
import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  Ban
} from "lucide-react";

import "../styles/FeaturedProducts.css";


// =====================================================
// PRODUCT TYPE
// =====================================================

interface Product {
  _id: string;
  name: string;
  category: string;
  subcategory: string;

  images: string[];

  description: string;

  features: string[];

  specifications: {
    name: string;
    value: string;
  }[];

  originalPrice: number;
  actualPrice: number;
  discountPercentage: number;

  rating: number;

  wishlist: boolean;

  initialStock: number;
  stock: number;
  totalStockSold: number;

  // Calculated by backend
  highDemand?: boolean;
}


// =====================================================
// COMPONENT
// =====================================================

const FeaturedProducts = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // GET FEATURED PRODUCTS
  // =====================================================

  useEffect(() => {

    const getFeaturedProducts = async () => {

      try {

        const response = await fetch(
          "https://ecomercy-backend.onrender.com/featured"
        );


        // Check API response
        if (!response.ok) {

          throw new Error(
            "Failed to fetch products"
          );

        }


        // Convert response to JavaScript object
        const data = await response.json();


        // Store products
        setProducts(data.products);


      } catch (error) {

        console.error(
          "Featured products error:",
          error
        );

        setError(
          "Unable to load products"
        );


      } finally {

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
          // OUT OF STOCK
          // =================================================

          const outOfStock =
            product.stock <= 0;


          return (

            <article
              className="product-card"
              key={product._id}
            >


              {/* =================================================
                  PRODUCT IMAGE
              ================================================= */}

              <div className="product-image-container">

                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />


                {/* =================================================
                    DISCOUNT
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

                      ₹
                      {Number(
                        product.actualPrice
                      ).toFixed(2)}

                    </span>


                    {/* Original price */}

                    {Number(
                      product.originalPrice
                    ) >
                      Number(
                        product.actualPrice
                      ) && (

                      <span className="original-price">

                        ₹
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
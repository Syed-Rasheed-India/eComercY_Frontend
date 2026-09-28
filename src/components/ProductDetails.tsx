import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import Navbar from "./Navbar";

import "../styles/ProductDetails.css";


const API_URL =
  "http://localhost:3000";


// ========================================
// TYPES
// ========================================

interface Specification {
  name: string;
  value: string;
}


interface Product {
  _id: string;

  name: string;

  category: string;

  subcategory: string;

  images: string[];

  description: string;

  features: string[];

  specifications: Specification[];

  originalPrice: number;

  actualPrice: number;

  discountPercentage: number;

  rating: number;

  wishlist: boolean;

  initialStock: number;

  stock: number;

  totalStockSold: number;
}


// ========================================
// COMPONENT
// ========================================

function ProductDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();


  // ========================================
  // STATE
  // ========================================

  const [
    showOrderPopup,
    setShowOrderPopup
  ] =
    useState(false);


  const [
    product,
    setProduct
  ] =
    useState<Product | null>(
      null
    );


  const [
    relatedProducts,
    setRelatedProducts
  ] =
    useState<Product[]>([]);


  const [
    selectedImage,
    setSelectedImage
  ] =
    useState(0);


  const [
    quantity,
    setQuantity
  ] =
    useState(1);


  const [
    loading,
    setLoading
  ] =
    useState(true);


  const [
    error,
    setError
  ] =
    useState("");


  const [
    placingOrder,
    setPlacingOrder
  ] =
    useState(false);


  // ========================================
  // PAYMENT METHOD
  // ========================================

  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod
  ] =
    useState("UPI");


  // ========================================
  // CHARGES
  // ========================================

  const deliveryCharge = 40;

  const packingCharge = 5;


  // ========================================
  // FETCH PRODUCT
  // ========================================

  useEffect(() => {

    const getProduct =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await fetch(
              `${API_URL}/products/${id}`
            );


          if (!response.ok) {

            throw new Error(
              "Failed to fetch product"
            );

          }


          const data =
            await response.json();


          if (!data.success) {

            throw new Error(
              data.message ||
              "Product not found"
            );

          }


          setProduct(
            data.product
          );


          setRelatedProducts(
            data.relatedProducts ||
            []
          );


          setSelectedImage(0);

          setQuantity(1);


        } catch (error) {

          console.error(
            "Product details error:",
            error
          );


          setError(
            "Unable to load product"
          );


        } finally {

          setLoading(false);

        }

      };


    if (id) {

      getProduct();

    }

  }, [id]);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <>

        <Navbar />

        <div className="product-details-loading">

          <div className="details-spinner"></div>

          <p>
            Loading product...
          </p>

        </div>

      </>
    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (
    error ||
    !product
  ) {

    return (
      <>

        <Navbar />

        <div className="product-details-error">

          <h2>
            {error ||
              "Product not found"}
          </h2>

          <Link to="/products">
            Back to Products
          </Link>

        </div>

      </>
    );

  }


  // ========================================
  // STOCK
  // ========================================

  const outOfStock =
    Number(product.stock) <= 0;


  // ========================================
  // QUANTITY
  // ========================================

  const decreaseQuantity =
    () => {

      setQuantity(
        (previous) =>
          Math.max(
            previous - 1,
            1
          )
      );

    };


  const increaseQuantity =
    () => {

      setQuantity(
        (previous) =>
          Math.min(
            previous + 1,
            product.stock
          )
      );

    };


  // ========================================
  // IMAGE
  // ========================================

  const currentImage =
    product.images?.[
      selectedImage
    ];


  // ========================================
  // PRICE CALCULATIONS
  // ========================================

  const productTotal =
    product.actualPrice *
    quantity;


  const finalTotal =
    productTotal +
    deliveryCharge +
    packingCharge;


  // ========================================
  // BUY NOW
  // ========================================

  const handleBuyNow =
    () => {

      if (outOfStock) {
        return;
      }

      // Reset payment method
      // whenever popup opens

      setSelectedPaymentMethod(
        "UPI"
      );

      setShowOrderPopup(true);

    };


  // ========================================
  // PAY NOW
  // ========================================

  const handlePayNow =
    async () => {

      try {

        setPlacingOrder(true);


        // --------------------------------
        // GET JWT TOKEN
        // --------------------------------

        const token =
          localStorage.getItem(
            "token"
          );


        // --------------------------------
        // TOKEN CHECK
        // --------------------------------

        if (!token) {

          alert(
            "Please login to place an order"
          );

          setShowOrderPopup(false);

          navigate("/login");

          return;

        }


        // --------------------------------
        // CREATE ORDER
        // --------------------------------

        const response =
          await fetch(
            `${API_URL}/orders`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`,

              },

              body:
                JSON.stringify({

                  productId:
                    product._id,

                  quantity:
                    quantity,

                  paymentMethod:
                    selectedPaymentMethod,

                  deliveryCharge:
                    deliveryCharge,

                  packingCharge:
                    packingCharge,

                  totalPrice:
                    finalTotal,

                }),

            }
          );


        const data =
          await response.json();


        // --------------------------------
        // API ERROR
        // --------------------------------

        if (!response.ok) {

          if (
            response.status === 401
          ) {

            localStorage.removeItem(
              "token"
            );

            alert(
              "Your session has expired. Please login again."
            );

            navigate("/login");

            return;

          }


          alert(
            data.message ||
            "Failed to place order"
          );

          return;

        }


        // --------------------------------
        // SUCCESS CHECK
        // --------------------------------

        if (!data.success) {

          alert(
            data.message ||
            "Failed to place order"
          );

          return;

        }


        // --------------------------------
        // CLOSE POPUP
        // --------------------------------

        setShowOrderPopup(false);


        // --------------------------------
        // GO TO SUCCESS PAGE
        // --------------------------------

        navigate(
          "/order-success",
          {
            state: {

              order:
                data.order,

              paymentMethod:
                selectedPaymentMethod,

            },
          }
        );


      } catch (error) {

        console.error(
          "Order error:",
          error
        );


        alert(
          "Failed to place order"
        );


      } finally {

        setPlacingOrder(false);

      }

    };


  // ========================================
  // UI
  // ========================================

  return (
    <>

      <Navbar />


      <main className="product-details-page">


        {/* =================================
            BREADCRUMB
        ================================= */}

        <div className="breadcrumb">

          <Link to="/home">
            Home
          </Link>

          <span>
            ›
          </span>

          <Link to="/products">
            Products
          </Link>

          <span>
            ›
          </span>

          <span>
            {product.name}
          </span>

        </div>


        {/* =================================
            MAIN PRODUCT SECTION
        ================================= */}

        <section className="product-main">


          {/* =================================
              IMAGE GALLERY
          ================================= */}

          <div className="product-gallery">

            <div className="main-product-image">

              {product.discountPercentage >
                0 && (

                <span className="product-discount">

                  -
                  {
                    product.discountPercentage
                  }
                  % OFF

                </span>

              )}


              {currentImage && (

                <img
                  src={currentImage}
                  alt={product.name}
                />

              )}

            </div>


            {/* THUMBNAILS */}

            <div className="product-thumbnails">

              {product.images?.map(
                (
                  image,
                  index
                ) => (

                  <button
                    key={`${image}-${index}`}

                    className={
                      selectedImage ===
                      index
                        ? "thumbnail active"
                        : "thumbnail"
                    }

                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }

                  >

                    <img
                      src={image}
                      alt={
                        `${product.name} ${
                          index + 1
                        }`
                      }
                    />

                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================
              PRODUCT INFORMATION
          ================================= */}

          <div className="product-information">


            {/* CATEGORY */}

            <div className="product-category">

              {product.subcategory}

              {" • "}

              SKU:
              {" "}
              {product._id.slice(-6)}

            </div>


            {/* NAME */}

            <h1>
              {product.name}
            </h1>


            {/* RATING */}

            <div className="product-rating">

              <div className="stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <Star
                      key={star}
                      size={16}

                      fill={
                        star <=
                        Math.round(
                          product.rating
                        )
                          ? "currentColor"
                          : "none"
                      }

                    />

                  )
                )}

              </div>


              <strong>
                {product.rating.toFixed(1)}
              </strong>


              <span>
                (128 reviews)
              </span>

            </div>


            {/* PRICE */}

            <div className="product-price">

              <span className="actual-price">

                $
                {Number(
                  product.actualPrice
                ).toFixed(2)}

              </span>


              {product.originalPrice >
                product.actualPrice && (

                <span className="original-price">

                  $
                  {Number(
                    product.originalPrice
                  ).toFixed(2)}

                </span>

              )}


              {product.discountPercentage >
                0 && (

                <span className="save-price">

                  Save $

                  {(
                    product.originalPrice -
                    product.actualPrice
                  ).toFixed(2)}

                </span>

              )}

            </div>


            {/* STOCK */}

            <div
              className={
                outOfStock
                  ? "stock out"
                  : "stock"
              }
            >

              <span className="stock-dot"></span>

              {outOfStock
                ? "Out of Stock"
                : `In Stock - Only ${product.stock} left`
              }

            </div>


            {/* DESCRIPTION */}

            <p className="product-short-description">

              {product.description}

            </p>


            {/* QUANTITY */}

            <div className="quantity-row">

              <div className="quantity-control">

                <button
                  onClick={
                    decreaseQuantity
                  }

                  disabled={
                    quantity <= 1
                  }
                >
                  −
                </button>


                <span>
                  {quantity}
                </span>


                <button
                  onClick={
                    increaseQuantity
                  }

                  disabled={
                    outOfStock ||
                    quantity >=
                    product.stock
                  }
                >
                  +
                </button>

              </div>


              <button
                className="wishlist-button"
              >

                <Heart
                  size={17}
                />

                Wishlist

              </button>

            </div>


            {/* ACTION BUTTONS */}

            <div className="product-actions">

              <button
                className="add-cart-button"

                disabled={
                  outOfStock
                }
              >

                <ShoppingCart
                  size={17}
                />

                Add to Cart

              </button>


              <button
                className="buy-now-button"

                disabled={
                  outOfStock ||
                  placingOrder
                }

                onClick={
                  handleBuyNow
                }
              >

                Buy Now

              </button>

            </div>


            {/* SERVICE INFO */}

            <div className="service-info">

              <div>

                <Truck size={18} />

                <strong>
                  Free Shipping
                </strong>

                <small>
                  On orders over $50
                </small>

              </div>


              <div>

                <ShieldCheck
                  size={18}
                />

                <strong>
                  2 Year Warranty
                </strong>

                <small>
                  Full coverage
                </small>

              </div>


              <div>

                <RotateCcw
                  size={18}
                />

                <strong>
                  Easy Returns
                </strong>

                <small>
                  30-day money back
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* =================================
            DESCRIPTION
        ================================= */}

        <section className="product-content">

          <div className="product-tabs">

            <button className="active">
              Description
            </button>

            <button>
              Specifications
            </button>

            <button>
              Shipping & Returns
            </button>

          </div>


          <div className="description-content">

            <p>
              {product.description}
            </p>


            {product.features?.length >
              0 && (

              <div className="feature-grid">

                {product.features.map(
                  (
                    feature,
                    index
                  ) => (

                    <div
                      className="feature-card"
                      key={index}
                    >

                      <h3>
                        {feature}
                      </h3>

                      <p>
                        Designed to provide
                        a comfortable and
                        reliable experience
                        for everyday use.
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>


        {/* =================================
            SPECIFICATIONS
        ================================= */}

        {product.specifications?.length >
          0 && (

          <section className="specifications-section">

            <h2>
              Specifications
            </h2>


            <div className="specifications-grid">

              {product.specifications.map(
                (spec) => (

                  <div
                    className="specification-row"
                    key={spec.name}
                  >

                    <span>
                      {spec.name}
                    </span>

                    <strong>
                      {spec.value}
                    </strong>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* =================================
            RELATED PRODUCTS
        ================================= */}

        {relatedProducts.length >
          0 && (

          <section className="related-products">

            <div className="related-header">

              <div>

                <h2>
                  Related Products
                </h2>

                <p>
                  You might also like
                  these products
                </p>

              </div>


              <Link to="/products">
                View All →
              </Link>

            </div>


            <div className="related-grid">

              {relatedProducts.map(
                (related) => (

                  <div
                    key={related._id}

                    className="related-card"

                    onClick={() =>
                      navigate(
                        `/products/${related._id}`
                      )
                    }
                  >

                    <div className="related-image">

                      {related.images?.[0] && (

                        <img
                          src={
                            related.images[0]
                          }

                          alt={
                            related.name
                          }
                        />

                      )}

                    </div>


                    <h3>
                      {related.name}
                    </h3>


                    <div className="related-price">

                      $
                      {Number(
                        related.actualPrice
                      ).toFixed(2)}

                    </div>


                    <button
                      onClick={(event) => {

                        event.stopPropagation();

                        // Cart logic
                        // will be added later

                      }}
                    >
                      Quick Add
                    </button>

                  </div>

                )
              )}

            </div>

          </section>

        )}

      </main>


      {/* =================================
          FOOTER
      ================================= */}

      <footer className="product-footer">

        <div>

          <h3>
            eComercY
          </h3>

          <p>
            Simple shopping.
            Better experience.
            <br />

            Discover high quality
            curated items tailored
            for your lifestyle.
          </p>

        </div>


        <div>

          <h3>
            Quick Links
          </h3>

          <Link to="/home">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/products">
            Categories
          </Link>

          <Link to="/orders">
            Orders
          </Link>

        </div>


        <div>

          <h3>
            Support & Legal
          </h3>

          <span>
            About
          </span>

          <span>
            Contact
          </span>

          <span>
            Privacy Policy
          </span>

          <span>
            Terms of Service
          </span>

        </div>


        <div>

          <h3>
            Connect
          </h3>

        </div>

      </footer>


      {/* =================================
          ORDER POPUP
      ================================= */}

      {showOrderPopup && (

        <div className="order-popup-overlay">

          <div className="order-popup">


            {/* CLOSE */}

            <button
              className="popup-close"

              onClick={() =>
                setShowOrderPopup(false)
              }
            >
              ×
            </button>


            <h2>
              Order Summary
            </h2>


            {/* PRODUCT */}

            <div className="popup-product">

              <img
                src={product.images?.[0]}
                alt={product.name}
              />


              <div className="popup-product-info">

                <h3>
                  {product.name}
                </h3>


                <p>
                  Price: $
                  {Number(
                    product.actualPrice
                  ).toFixed(2)}
                </p>


                <p>
                  Quantity: {quantity}
                </p>

              </div>

            </div>


            {/* PAYMENT METHOD */}

            <div className="payment-section">

              <h3>
                Payment Method
              </h3>


              {/* UPI */}

              <label className="payment-option">

                <input
                  type="radio"

                  name="paymentMethod"

                  value="UPI"

                  checked={
                    selectedPaymentMethod ===
                    "UPI"
                  }

                  onChange={(e) =>
                    setSelectedPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  UPI
                </span>

              </label>


              {/* NET BANKING */}

              <label className="payment-option">

                <input
                  type="radio"

                  name="paymentMethod"

                  value="Net Banking"

                  checked={
                    selectedPaymentMethod ===
                    "Net Banking"
                  }

                  onChange={(e) =>
                    setSelectedPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Net Banking
                </span>

              </label>


              {/* CASH ON DELIVERY */}

              <label className="payment-option">

                <input
                  type="radio"

                  name="paymentMethod"

                  value="Cash on Delivery"

                  checked={
                    selectedPaymentMethod ===
                    "Cash on Delivery"
                  }

                  onChange={(e) =>
                    setSelectedPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Cash on Delivery
                </span>

              </label>

            </div>


            {/* DELIVERY INFORMATION */}

            <div className="delivery-info">


              {/* DELIVERY CHARGE */}

              <div>

                <span>
                  Delivery charge
                </span>

                <strong>
                  ${deliveryCharge.toFixed(2)}
                </strong>

              </div>


              {/* PACKING CHARGE */}

              <div>

                <span>
                  Packing charge
                </span>

                <strong>
                  ${packingCharge.toFixed(2)}
                </strong>

              </div>


              {/* EXPECTED DELIVERY */}

              <div className="expected-delivery">

                <span>
                  Expected delivery
                </span>

                <strong>
                  After 10 days
                </strong>

              </div>

            </div>


            {/* TOTAL */}

            <div className="popup-total">

              <span>
                Total
              </span>


              <strong>

                $
                {finalTotal.toFixed(2)}

              </strong>

            </div>


            {/* PAY NOW */}

            <button
              className="pay-now-button"

              disabled={
                placingOrder
              }

              onClick={
                handlePayNow
              }
            >

              {placingOrder
                ? "Processing..."
                : "Pay Now"}

            </button>

          </div>

        </div>

      )}

    </>
  );
}


export default ProductDetails;
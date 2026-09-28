import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  Star,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "../styles/Products.css";

// ======================================================
// API
// ======================================================

const API_URL = "https://ecomercy-backend.onrender.com";

// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  "All",
  "Consumer Electronics & Gadgets",
  "Apparel & Fashion Accessories",
  "Home, Kitchen & Decor",
  "Beauty & Personal Care",
  "Health & Wellness",
];

// ======================================================
// COMPONENT
// ======================================================

const Products = () => {
  const navigate = useNavigate();

  // ======================================================
  // URL SEARCH PARAMS
  // ======================================================

  const [searchParams, setSearchParams] =
    useSearchParams();

  // ======================================================
  // PRODUCTS
  // ======================================================

  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================================
  // FILTER STATE
  // ======================================================

  const [category, setCategory] =
    useState("All");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [rating, setRating] =
    useState("");

  const [search, setSearch] =
    useState(
      searchParams.get("search") || ""
    );

  const [sort, setSort] =
    useState("featured");

  // ======================================================
  // PAGINATION
  // ======================================================

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalProducts, setTotalProducts] =
    useState(0);

  // ======================================================
  // MOBILE FILTER
  // ======================================================

  const [showFilters, setShowFilters] =
    useState(false);

  // ======================================================
  // UPDATE SEARCH WHEN URL CHANGES
  // ======================================================

  useEffect(() => {
    const urlSearch =
      searchParams.get("search") || "";

    setSearch(urlSearch);
    setPage(1);
  }, [searchParams]);

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // ----------------------------------------------
        // BUILD QUERY
        // ----------------------------------------------

        const params =
          new URLSearchParams();

        params.append(
          "page",
          page.toString()
        );

        params.append(
          "limit",
          "12"
        );

        // SEARCH
        if (search.trim()) {
          params.append(
            "search",
            search.trim()
          );
        }

        // CATEGORY
        if (category !== "All") {
          params.append(
            "category",
            category
          );
        }

        // MIN PRICE
        if (minPrice !== "") {
          params.append(
            "minPrice",
            minPrice
          );
        }

        // MAX PRICE
        if (maxPrice !== "") {
          params.append(
            "maxPrice",
            maxPrice
          );
        }

        // RATING
        if (rating !== "") {
          params.append(
            "rating",
            rating
          );
        }

        // SORT
        params.append(
          "sort",
          sort
        );

        // ----------------------------------------------
        // API REQUEST
        // ----------------------------------------------

        const response =
          await fetch(
            `${API_URL}/products?${params.toString()}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data =
          await response.json();

        if (!data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch products"
          );
        }

        // ----------------------------------------------
        // SET DATA
        // ----------------------------------------------

        setProducts(
          data.products || []
        );

        setTotalPages(
          data.totalPages || 1
        );

        setTotalProducts(
          data.totalProducts || 0
        );

      } catch (error) {
        console.error(
          "Products error:",
          error
        );

        setError(
          "Unable to load products"
        );

      } finally {
        setLoading(false);
      }
    };

    getProducts();

  }, [
    page,
    category,
    minPrice,
    maxPrice,
    rating,
    search,
    sort,
  ]);

  // ======================================================
  // ADD TO WISHLIST
  // ======================================================

  const addToWishlist = async (
    productId: string
  ) => {
    const token =
      localStorage.getItem("token");

    // USER NOT LOGGED IN
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/wishlist/${productId}`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Update UI immediately
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                wishlist: true,
              }
            : product
        )
      );

      alert("Added to wishlist");

    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );
    }
  };

  // ======================================================
  // REMOVE FROM WISHLIST
  // ======================================================

  const removeFromWishlist = async (
    productId: string
  ) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/wishlist/${productId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Update UI immediately
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                wishlist: false,
              }
            : product
        )
      );

      alert("Removed from wishlist");

    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );
    }
  };

  // ======================================================
  // WISHLIST BUTTON
  // ======================================================

  const handleWishlist = async (
    e: React.MouseEvent,
    product: any
  ) => {
    // VERY IMPORTANT
    // Prevent product card navigation
    e.stopPropagation();

    if (product.wishlist) {
      await removeFromWishlist(
        product._id
      );
    } else {
      await addToWishlist(
        product._id
      );
    }
  };

  // ======================================================
  // ADD TO CART
  // ======================================================

  const addToCart = async (
    e: React.MouseEvent,
    productId: string
  ) => {
    // VERY IMPORTANT
    // Prevent product details navigation
    e.stopPropagation();

    const token =
      localStorage.getItem("token");

    // USER NOT LOGGED IN
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/cart/${productId}`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Added to cart");

    } catch (error) {
      console.error(
        "Cart error:",
        error
      );
    }
  };

  // ======================================================
  // RESET FILTERS
  // ======================================================

  const resetFilters = () => {
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSearch("");
    setSort("featured");
    setPage(1);

    setSearchParams({});
  };

  // ======================================================
  // CHANGE CATEGORY
  // ======================================================

  const changeCategory = (
    value: string
  ) => {
    setCategory(value);
    setPage(1);
  };

  // ======================================================
  // CHANGE RATING
  // ======================================================

  const changeRating = (
    value: string
  ) => {
    setRating(value);
    setPage(1);
  };

  // ======================================================
  // ACTIVE FILTERS
  // ======================================================

  const activeFilters: {
    label: string;
    type: string;
  }[] = [];

  // SEARCH FILTER

  if (search.trim()) {
    activeFilters.push({
      label: `Search: ${search}`,
      type: "search",
    });
  }

  // CATEGORY FILTER

  if (category !== "All") {
    activeFilters.push({
      label: category,
      type: "category",
    });
  }

  // PRICE FILTER

  if (
    minPrice !== "" ||
    maxPrice !== ""
  ) {
    let label = "Price";

    if (
      minPrice &&
      maxPrice
    ) {
      label =
        `$${minPrice} - $${maxPrice}`;
    } else if (minPrice) {
      label =
        `$${minPrice}+`;
    } else if (maxPrice) {
      label =
        `Up to $${maxPrice}`;
    }

    activeFilters.push({
      label,
      type: "price",
    });
  }

  // RATING FILTER

  if (rating !== "") {
    activeFilters.push({
      label:
        `${rating}★ & up`,
      type: "rating",
    });
  }

  // ======================================================
  // REMOVE ACTIVE FILTER
  // ======================================================

  const removeFilter = (
    type: string
  ) => {
    if (type === "search") {
      setSearch("");
      setSearchParams({});
    }

    if (type === "category") {
      setCategory("All");
    }

    if (type === "price") {
      setMinPrice("");
      setMaxPrice("");
    }

    if (type === "rating") {
      setRating("");
    }

    setPage(1);
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="products-page">

          <div className="products-breadcrumb">

            <span>
              CATALOG
            </span>

            <span>
              /
            </span>

            <strong>
              ALL PRODUCTS
            </strong>

          </div>

          <div className="products-title-row">

            <h1>
              All Products
            </h1>

          </div>

          <div className="products-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading products...
            </p>

          </div>

        </main>
      </>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="products-page">

          <div className="products-breadcrumb">

            <span>
              CATALOG
            </span>

            <span>
              /
            </span>

            <strong>
              ALL PRODUCTS
            </strong>

          </div>

          <div className="products-error">

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        </main>
      </>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <>
      <Navbar />

      <main className="products-page">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="products-breadcrumb">

          <span>
            CATALOG
          </span>

          <span>
            /
          </span>

          <strong>
            {search
              ? `SEARCH: ${search.toUpperCase()}`
              : "ALL PRODUCTS"}
          </strong>

        </div>

        {/* ==================================================
            TITLE
        ================================================== */}

        <div className="products-title-row">

          <div>

            <h1>
              {search
                ? `Search results for "${search}"`
                : "All Products"}
            </h1>

          </div>

          <span className="products-count">

            Showing {totalProducts} items

          </span>

        </div>

        {/* ==================================================
            MOBILE FILTER BUTTON
        ================================================== */}

        <button
          className="mobile-filter-button"
          onClick={() =>
            setShowFilters(true)
          }
        >

          <SlidersHorizontal
            size={17}
          />

          Filters

        </button>

        {/* ==================================================
            MAIN LAYOUT
        ================================================== */}

        <div className="products-layout">

          {/* ==================================================
              FILTER SIDEBAR
          ================================================== */}

          <aside
            className={
              showFilters
                ? "filter-sidebar mobile-open"
                : "filter-sidebar"
            }
          >

            {/* FILTER HEADER */}

            <div className="filter-header">

              <div className="filter-title">

                <SlidersHorizontal
                  size={16}
                />

                <span>
                  Filters
                </span>

              </div>

              <button
                className="reset-button"
                onClick={resetFilters}
              >
                Reset All
              </button>

              <button
                className="mobile-close-filter"
                onClick={() =>
                  setShowFilters(false)
                }
              >

                <X size={20} />

              </button>

            </div>

            {/* ==================================================
                CATEGORY
            ================================================== */}

            <div className="filter-section">

              <h3>
                Categories
              </h3>

              <div className="category-list">

                {categories.map(
                  (item) => (

                    <label
                      className="category-option"
                      key={item}
                    >

                      <input
                        type="radio"
                        name="category"
                        checked={
                          category === item
                        }
                        onChange={() =>
                          changeCategory(
                            item
                          )
                        }
                      />

                      <span className="custom-radio"></span>

                      <span>

                        {item === "All"
                          ? "All Products"
                          : item}

                      </span>

                    </label>

                  )
                )}

              </div>

            </div>

            {/* ==================================================
                PRICE
            ================================================== */}

            <div className="filter-section">

              <div className="filter-section-title">

                <h3>
                  Price Range
                </h3>

                <span>

                  {minPrice ||
                  maxPrice
                    ? `$${minPrice || 0} - $${maxPrice || "∞"}`
                    : "$0 - $500"}

                </span>

              </div>

              <div className="price-inputs">

                <div>

                  <span>
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="10"
                    value={minPrice}
                    onChange={(e) => {

                      setMinPrice(
                        e.target.value
                      );

                      setPage(1);

                    }}
                  />

                </div>

                <span className="price-dash">
                  —
                </span>

                <div>

                  <span>
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    value={maxPrice}
                    onChange={(e) => {

                      setMaxPrice(
                        e.target.value
                      );

                      setPage(1);

                    }}
                  />

                </div>

              </div>

            </div>

            {/* ==================================================
                RATING
            ================================================== */}

            <div className="filter-section">

              <h3>
                Minimum Rating
              </h3>

              <div className="rating-options">

                <label>

                  <input
                    type="radio"
                    name="rating"
                    checked={
                      rating === "4"
                    }
                    onChange={() =>
                      changeRating("4")
                    }
                  />

                  <span className="rating-radio"></span>

                  <span className="stars">
                    ★★★★
                  </span>

                  <span>
                    & up
                  </span>

                </label>

                <label>

                  <input
                    type="radio"
                    name="rating"
                    checked={
                      rating === "3"
                    }
                    onChange={() =>
                      changeRating("3")
                    }
                  />

                  <span className="rating-radio"></span>

                  <span className="stars">
                    ★★★
                  </span>

                  <span>
                    & up
                  </span>

                </label>

                <label>

                  <input
                    type="radio"
                    name="rating"
                    checked={
                      rating === "2"
                    }
                    onChange={() =>
                      changeRating("2")
                    }
                  />

                  <span className="rating-radio"></span>

                  <span>
                    All Ratings
                  </span>

                </label>

              </div>

            </div>

          </aside>

          {/* ==================================================
              PRODUCTS CONTENT
          ================================================== */}

          <section className="products-content">

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div className="products-toolbar">

              <div className="active-filters">

                <span className="active-label">
                  Active Filters:
                </span>

                {activeFilters.length === 0 ? (

                  <span className="no-filter">
                    None
                  </span>

                ) : (

                  activeFilters.map(
                    (filter) => (

                      <button
                        className="filter-chip"
                        key={filter.type}
                        onClick={() =>
                          removeFilter(
                            filter.type
                          )
                        }
                      >

                        <span>
                          {filter.label}
                        </span>

                        <X size={12} />

                      </button>

                    )
                  )

                )}

              </div>

              {/* SORT */}

              <div className="sort-container">

                <span>
                  Sort by:
                </span>

                <select
                  value={sort}
                  onChange={(e) => {

                    setSort(
                      e.target.value
                    );

                    setPage(1);

                  }}
                >

                  <option value="featured">
                    Featured
                  </option>

                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                </select>

              </div>

            </div>

            {/* ==================================================
                EMPTY
            ================================================== */}

            {products.length === 0 ? (

              <div className="empty-products">

                <h2>
                  No products found
                </h2>

                <p>
                  No products match your
                  current search or filters.
                </p>

                <button
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              /* ==================================================
                 PRODUCT GRID
              ================================================== */

              <div className="products-grid-page">

                {products.map(
                  (product) => {

                    const outOfStock =
                      Number(
                        product.stock
                      ) <= 0;

                    return (

                      <article
                        className="shop-product-card"
                        key={product._id}

                        onClick={() =>
                          navigate(
                            `/products/${product._id}`
                          )
                        }
                      >

                        {/* ==================================================
                            PRODUCT IMAGE
                        ================================================== */}

                        <div className="shop-product-image">

                          {/* DISCOUNT */}

                          {product.discountPercentage > 0 &&
                            !outOfStock && (

                              <span className="shop-discount">

                                -
                                {
                                  product.discountPercentage
                                }%

                              </span>

                          )}

                          {/* IMAGE */}

                          <img
                            src={
                              product.images?.[0]
                                ? `${product.images[0]}?auto=format&fit=crop&w=500&q=75`
                                : "/placeholder.png"
                            }

                            alt={product.name}

                            width="300"
                            height="300"

                            loading="lazy"
                            decoding="async"

                            onError={(e) => {

                              console.log(
                                "IMAGE FAILED:",
                                {
                                  name:
                                    product.name,

                                  image:
                                    product.images?.[0],
                                }
                              );

                              e.currentTarget.src =
                                "/placeholder.png";
                            }}
                          />

                          {/* ==================================================
                              WISHLIST
                          ================================================== */}

                          <button
                            type="button"

                            className={
                              product.wishlist
                                ? "shop-wishlist active"
                                : "shop-wishlist"
                            }

                            onClick={(e) =>
                              handleWishlist(
                                e,
                                product
                              )
                            }
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

                          {/* OUT OF STOCK */}

                          {outOfStock && (

                            <span className="shop-out-stock">
                              Out of Stock
                            </span>

                          )}

                        </div>

                        {/* ==================================================
                            PRODUCT INFO
                        ================================================== */}

                        <div className="shop-product-info">

                          {/* META */}

                          <div className="shop-product-meta">

                            <span>

                              {
                                product.subcategory ||
                                product.category
                              }

                            </span>

                            <span className="shop-rating">

                              <Star
                                size={12}
                                fill="currentColor"
                              />

                              {Number(
                                product.rating
                              ).toFixed(1)}

                            </span>

                          </div>

                          {/* NAME */}

                          <h2>
                            {product.name}
                          </h2>

                          {/* BOTTOM */}

                          <div className="shop-product-bottom">

                            {/* PRICE */}

                            <div className="shop-price">

                              <span className="shop-actual-price">

                                $
                                {Number(
                                  product.actualPrice
                                ).toFixed(2)}

                              </span>

                              {Number(
                                product.originalPrice
                              ) >
                                Number(
                                  product.actualPrice
                                ) && (

                                  <span className="shop-original-price">

                                    $
                                    {Number(
                                      product.originalPrice
                                    ).toFixed(2)}

                                  </span>

                                )}

                            </div>

                            {/* ADD CART */}

                            <button
                              type="button"

                              className={
                                outOfStock
                                  ? "shop-add-cart disabled"
                                  : "shop-add-cart"
                              }

                              disabled={
                                outOfStock
                              }

                              onClick={(e) =>
                                addToCart(
                                  e,
                                  product._id
                                )
                              }
                            >

                              <ShoppingCart
                                size={15}
                              />

                              <span>

                                {outOfStock
                                  ? "Unavailable"
                                  : "Add"}

                              </span>

                            </button>

                          </div>

                        </div>

                      </article>

                    );
                  }
                )}

              </div>

            )}

            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (

              <div className="pagination">

                {/* PREVIOUS */}

                <button
                  className="pagination-arrow"

                  disabled={
                    page === 1
                  }

                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.max(
                          prev - 1,
                          1
                        )
                    )
                  }
                >

                  <ChevronLeft
                    size={17}
                  />

                </button>

                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (number) => (

                    <button
                      key={number}

                      className={
                        page === number
                          ? "pagination-number active"
                          : "pagination-number"
                      }

                      onClick={() =>
                        setPage(number)
                      }
                    >

                      {number}

                    </button>

                  )
                )}

                {/* NEXT */}

                <button
                  className="pagination-arrow"

                  disabled={
                    page ===
                    totalPages
                  }

                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                    )
                  }
                >

                  <ChevronRight
                    size={17}
                  />

                </button>

              </div>

            )}

          </section>

        </div>

      </main>
    </>
  );
};

export default Products;
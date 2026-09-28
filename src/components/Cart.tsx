import { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import "../styles/Cart.css";

const API_URL = "http://localhost:3000";

interface Product {
  _id: string;
  name: string;
  images?: string[];
  actualPrice: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

function Cart() {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getCart = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/cart`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data =
        await response.json();

      setCart(data.cart || []);

    } catch (error) {

      console.error(
        "Cart error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    getCart();
  }, []);


  const updateQuantity = async (
    productId: string,
    quantity: number
  ) => {

    if (quantity < 1) {
      return;
    }

    const token =
      localStorage.getItem("token");

    try {

      const response = await fetch(
        `${API_URL}/cart/${productId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setCart(data.cart);

    } catch (error) {

      console.error(error);

    }
  };


  const removeFromCart = async (
    productId: string
  ) => {

    const token =
      localStorage.getItem("token");

    try {

      const response = await fetch(
        `${API_URL}/cart/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {

        setCart((prev) =>
          prev.filter(
            (item) =>
              item.product._id !==
              productId
          )
        );

      }

    } catch (error) {

      console.error(error);

    }
  };


  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.product.actualPrice *
      item.quantity,
    0
  );


  if (loading) {

    return (
      <>
        <Navbar />

        <div className="cart-page">
          <p>Loading cart...</p>
        </div>
      </>
    );

  }


  return (
    <>
      <Navbar />

      <main className="cart-page">

        <div className="cart-header">

          <h1>My Cart</h1>

          <p>
            {cart.length} product
            {cart.length !== 1
              ? "s"
              : ""}
          </p>

        </div>


        {cart.length === 0 ? (

          <div className="empty-cart">

            <ShoppingCart size={50} />

            <h2>
              Your cart is empty
            </h2>

            <p>
              Add products to your cart
              to see them here.
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

          <div className="cart-container">

            <div className="cart-list">

              {cart.map((item) => (

                <div
                  className="cart-card"
                  key={item.product._id}
                >

                  <div className="cart-image">

                    <img
                      src={
                        item.product
                          .images?.[0]
                      }
                      alt={
                        item.product.name
                      }
                    />

                  </div>


                  <div className="cart-details">

                    <h2>
                      {item.product.name}
                    </h2>

                    <p className="cart-price">
                      $
                      {item.product.actualPrice.toFixed(
                        2
                      )}
                    </p>


                    <div className="cart-quantity">

                      <span>
                        Quantity
                      </span>

                      <div className="quantity-control">

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                        >
                          <Minus
                            size={15}
                          />
                        </button>


                        <span>
                          {item.quantity}
                        </span>


                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.product.stock
                          }
                        >
                          <Plus
                            size={15}
                          />
                        </button>

                      </div>

                    </div>


                    <p className="cart-item-total">

                      Total:

                      <strong>
                        $
                        {(
                          item.product
                            .actualPrice *
                          item.quantity
                        ).toFixed(2)}
                      </strong>

                    </p>


                    <button
                      className="remove-cart"
                      onClick={() =>
                        removeFromCart(
                          item.product._id
                        )
                      }
                    >
                      <Trash2 size={15} />

                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>


            <div className="cart-summary">

              <h2>
                Order Summary
              </h2>

              <div className="summary-row">

                <span>
                  Products
                </span>

                <strong>
                  {cart.length}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Total
                </span>

                <strong>
                  ${total.toFixed(2)}
                </strong>

              </div>


              <button
                className="checkout-button"
                onClick={() =>
                  alert(
                    "Checkout coming soon"
                  )
                }
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        )}

      </main>
    </>
  );
}

export default Cart;
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "./Navbar";

import "../styles/Orders.css";


const API_URL =
  "http://localhost:3000";


// ========================================
// TYPES
// ========================================

interface Order {

  _id: string;

  product: string;

  productName: string;

  productImage: string;

  price: number;

  quantity: number;

  totalPrice: number;

  status: string;

  createdAt: string;

}


// ========================================
// COMPONENT
// ========================================

function Orders() {

  const navigate =
    useNavigate();


  // ========================================
  // STATE
  // ========================================

  const [
    orders,
    setOrders
  ] =
    useState<Order[]>([]);


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
    updatingOrderId,
    setUpdatingOrderId
  ] =
    useState<string | null>(
      null
    );


  // ========================================
  // GET ORDERS
  // ========================================

  useEffect(() => {

    const getOrders =
      async () => {

        try {

          setLoading(true);

          setError("");


          // --------------------------------
          // GET TOKEN
          // --------------------------------

          const token =
            localStorage.getItem(
              "token"
            );


          // --------------------------------
          // CHECK LOGIN
          // --------------------------------

          if (!token) {

            navigate("/login");

            return;

          }


          // --------------------------------
          // GET ORDERS
          // --------------------------------

          const response =
            await fetch(
              `${API_URL}/orders`,
              {
                method: "GET",

                headers: {
                  "Authorization":
                    `Bearer ${token}`,
                },

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

              navigate("/login");

              return;

            }


            throw new Error(
              data.message ||
              "Failed to fetch orders"
            );

          }


          // --------------------------------
          // SET ORDERS
          // --------------------------------

          setOrders(
            data.orders || []
          );


        } catch (error) {

          console.error(
            "Orders error:",
            error
          );


          setError(
            "Unable to load orders"
          );


        } finally {

          setLoading(false);

        }

      };


    getOrders();

  }, [navigate]);


  // ========================================
  // EXPECTED DELIVERY
  // 10 DAYS AFTER ORDER DATE
  // ========================================

  const getExpectedDelivery =
    (createdAt: string) => {

      const deliveryDate =
        new Date(createdAt);


      deliveryDate.setDate(
        deliveryDate.getDate() + 10
      );


      return deliveryDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  // ========================================
  // REDUCE QUANTITY
  // ========================================

  const decreaseQuantity =
    async (
      order: Order
    ) => {

      // --------------------------------
      // DON'T GO BELOW 1
      // --------------------------------

      if (
        order.quantity <= 1
      ) {

        return;

      }


      // --------------------------------
      // NEW QUANTITY
      // --------------------------------

      const newQuantity =
        order.quantity - 1;


      try {

        setUpdatingOrderId(
          order._id
        );


        // --------------------------------
        // GET TOKEN
        // --------------------------------

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate("/login");

          return;

        }


        // --------------------------------
        // UPDATE ORDER
        // --------------------------------

        const response =
          await fetch(
            `${API_URL}/orders/${order._id}`,
            {

              method: "PATCH",

              headers: {

                "Content-Type":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`,

              },

              body:
                JSON.stringify({

                  quantity:
                    newQuantity,

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

            navigate("/login");

            return;

          }


          alert(
            data.message ||
            "Unable to update quantity"
          );

          return;

        }


        // --------------------------------
        // UPDATE REACT STATE
        // --------------------------------

        setOrders(
          (previousOrders) =>

            previousOrders.map(
              (item) =>

                item._id ===
                order._id

                  ? data.order

                  : item

            )
        );


      } catch (error) {

        console.error(
          "Quantity update error:",
          error
        );


        alert(
          "Unable to update quantity"
        );


      } finally {

        setUpdatingOrderId(
          null
        );

      }

    };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <>

        <Navbar />

        <main className="orders-page">

          <h1>
            My Orders
          </h1>

          <p>
            Loading orders...
          </p>

        </main>

      </>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (

      <>

        <Navbar />

        <main className="orders-page">

          <h1>
            My Orders
          </h1>

          <p className="orders-error">
            {error}
          </p>

        </main>

      </>

    );

  }


  // ========================================
  // UI
  // ========================================

  return (

    <>

      <Navbar />


      <main className="orders-page">


        {/* =================================
            HEADER
        ================================= */}

        <div className="orders-header">

          <h1>
            My Orders
          </h1>


          <p>

            {orders.length}{" "}

            {
              orders.length === 1
                ? "order"
                : "orders"
            }

          </p>

        </div>


        {/* =================================
            NO ORDERS
        ================================= */}

        {orders.length === 0 ? (

          <div className="no-orders">

            <h2>
              No orders available
            </h2>


            <p>
              You haven't purchased
              any products yet.
            </p>

          </div>

        ) : (


          /* =================================
             ORDERS LIST
          ================================= */

          <div className="orders-list">

            {orders.map(
              (order) => (

                <article
                  className="order-card"
                  key={
                    order._id
                  }
                >


                  {/* =========================
                      IMAGE
                  ========================= */}

                  <div className="order-image">

                    {order.productImage && (

                      <img
                        src={
                          order.productImage
                        }

                        alt={
                          order.productName
                        }
                      />

                    )}

                  </div>


                  {/* =========================
                      DETAILS
                  ========================= */}

                  <div className="order-details">


                    {/* PRODUCT NAME */}

                    <h2>
                      {order.productName}
                    </h2>


                    {/* PRICE */}

                    <p className="order-price">

                      $
                      {Number(
                        order.price
                      ).toFixed(2)}

                    </p>


                    {/* QUANTITY */}

                    <div className="order-quantity">

                      <span>
                        Quantity
                      </span>


                      <div className="quantity-control">


                        {/* MINUS */}

                        <button

                          onClick={() =>
                            decreaseQuantity(
                              order
                            )
                          }

                          disabled={
                            order.quantity <=
                              1 ||
                            updatingOrderId ===
                              order._id
                          }

                        >
                          −
                        </button>


                        {/* CURRENT */}

                        <span>
                          {
                            order.quantity
                          }
                        </span>


                        {/* PLUS */}

                        <span
                          className="quantity-plus-disabled"
                        >
                          +
                        </span>

                      </div>

                    </div>


                    {/* TOTAL */}

                    <p className="order-total">

                      Total:

                      <strong>

                        $
                        {Number(
                          order.totalPrice
                        ).toFixed(2)}

                      </strong>

                    </p>


                    {/* =================================
                        EXPECTED DELIVERY
                    ================================= */}

                    <div className="order-delivery">

                      <span>
                        Expected Delivery
                      </span>

                      <strong>
                        {
                          getExpectedDelivery(
                            order.createdAt
                          )
                        }
                      </strong>

                    </div>


                    {/* STATUS */}

                    <span className="order-status">

                      {
                        order.status
                      }

                    </span>


                  </div>

                </article>

              )
            )}

          </div>

        )}

      </main>

    </>

  );

}


export default Orders;
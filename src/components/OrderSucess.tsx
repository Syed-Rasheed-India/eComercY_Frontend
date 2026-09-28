import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "./Navbar";
import "../styles/OrderSucess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  const orderId =
    order?._id?.slice(-6).toUpperCase() || "84920";

  const totalAmount =
    order?.totalPrice || 0;

  const paymentMethod =
    location.state?.paymentMethod || "UPI";

  return (
    <>
      <Navbar />

      <main className="order-success-page">

        <div className="success-icon">
          <CheckCircle size={30} />
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for your purchase. We have received your order
          <br />
          and are getting it ready.
        </p>

        <div className="success-card">

          <div className="success-card-title">
            Order Summary #{orderId}
          </div>

          <div className="success-divider"></div>

          <div className="success-details">

            <div>
              <span>Total Amount</span>
              <strong>
                ${Number(totalAmount).toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Expected Delivery</span>
              <strong>
                After 10 days
              </strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>
                {paymentMethod}
              </strong>
            </div>

            <div>
              <span>Shipping Status</span>
              <strong className="processing">
                Processing
              </strong>
            </div>

          </div>

        </div>

        <div className="success-actions">

          <button
            className="view-orders-button"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>

          <button
            className="continue-shopping-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>

        </div>

      </main>
    </>
  );
}

export default OrderSuccess;
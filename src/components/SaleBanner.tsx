import { Share2, Globe, MessageSquare } from "lucide-react";
import "../styles/SaleBanner.css";

const SaleBanner = () => {
  return (
    <div className="footer-section">

      {/* ================= SALE BANNER ================= */}

      <section className="sale-wrapper">
        <div className="sale-banner">

          <div className="sale-content">

            <span className="sale-label">
              LIMITED TIME OFFER
            </span>

            <h3>
              Summer Mega Sale - Up to 40% Off on Electronics & Fashion
            </h3>

            <p>
              Upgrade your wardrobe and tech essentials with our biggest
              seasonal discount. Free shipping included.
            </p>

          </div>

          <button className="sale-button">
            Shop the Sale
          </button>

        </div>
      </section>


      {/* ================= FOOTER ================= */}

      <footer className="main-footer">

        <div className="footer-container">

          {/* Brand */}

          <div className="footer-column brand-column">

            <h3>eComercY</h3>

            <p>
              Simple shopping. Better experience.
              <br />
              Discover high quality curated items
              <br />
              tailored for your lifestyle.
            </p>

          </div>


          {/* Quick Links */}

          <div className="footer-column">

            <h4>Quick Links</h4>

            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Categories</a>
            <a href="#">Orders</a>

          </div>


          {/* Support */}

          <div className="footer-column">

            <h4>Support & Legal</h4>

            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>

          </div>


          {/* Connect */}

          <div className="footer-column connect-column">

            <h4>Connect</h4>

            <div className="social-icons">

              <button aria-label="Share">
                <Share2 size={15} />
              </button>

              <button aria-label="Website">
                <Globe size={15} />
              </button>

              <button aria-label="Messages">
                <MessageSquare size={15} />
              </button>

            </div>

          </div>

        </div>


        {/* ================= COPYRIGHT BAR ================= */}

        <div className="footer-bottom">

          <div className="copyright">
            © 2024 eComercY Inc. All rights reserved.
          </div>

          <div className="footer-features">

            <span>Secure Payments</span>
            <span>24/7 Support</span>
            <span>Global Shipping</span>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default SaleBanner;
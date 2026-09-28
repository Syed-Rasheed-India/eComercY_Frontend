import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
//   Github
} from "lucide-react";

import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    // Prevent page refresh
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {

      const response = await fetch(
      "https://ecomercy-backend.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

      const data = await response.json();


      // Backend returned an error
      if (!response.ok) {

        setMessage(data.message);

        return;
      }


      // Login successful
      console.log(data);

      // Store JWT
      localStorage.setItem(
        "token",
        data.token
      );


      // Optional user information
      localStorage.setItem(
        "userEmail",
        email
      );


      setMessage("Login successful");


      // Go to home page
      navigate("/home");


    } catch (error) {

      console.log(error);

      setMessage(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-page">

      <div className="login-card">


        {/* Logo */}

        <div className="login-logo">

          <ShoppingBag size={19} />

        </div>


        {/* Heading */}

        <h1>
          Welcome back to
          <br />
          eComercY
        </h1>


        <p className="subtitle">
          Simple shopping. Better experience.
        </p>



        <form onSubmit={handleSubmit}>


          {/* Email */}

          <div className="input-group">

            <label>
              Email address
            </label>


            <div className="input-wrapper">

              <Mail size={14} />


              <input
                type="email"
                placeholder="name@example.com"

                value={email}

                onChange={(e) =>
                  setEmail(e.target.value)
                }

                required
              />

            </div>

          </div>



          {/* Password */}

          <div className="input-group">

            <label>
              Password
            </label>


            <div className="input-wrapper">

              <Lock size={14} />


              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                placeholder="Enter your password"

                value={password}

                onChange={(e) =>
                  setPassword(e.target.value)
                }

                required
              />


              <button
                type="button"

                className="eye-button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}

              </button>

            </div>

          </div>



          {/* Remember + Forgot */}

          <div className="login-options">


            <label className="remember">

              <input
                type="checkbox"

                checked={remember}

                onChange={(e) =>
                  setRemember(
                    e.target.checked
                  )
                }
              />

              <span>
                Remember this device
              </span>

            </label>


            <button
              type="button"
              className="forgot-button"
            >
              Forgot password?
            </button>

          </div>



          {/* Message */}

          {message && (

            <p className="login-message">
              {message}
            </p>

          )}



          {/* Login button */}

          <button
            type="submit"
            className="login-button"

            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Sign In"
            }

            {!loading && (
              <ArrowRight size={14} />
            )}

          </button>

        </form>



        {/* Divider */}

        <div className="divider">

          <span></span>

          <p>
            or continue with
          </p>

          <span></span>

        </div>



        {/* Social buttons */}

        {/* <div className="social-buttons">


          <button type="button">

            <span className="google-icon">
              G
            </span>

            Google

          </button>


          <button type="button">

            <Github size={14} />

            Github

          </button>

        </div> */}



        {/* Register */}

        <p className="register-text">

          Don't have an account?{" "}

          <button
            type="button"

            onClick={() =>
              navigate("/")
            }
          >
            Create account
          </button>

        </p>

      </div>



      {/* Bottom security */}

      {/* <div className="security">

        <span>
          🔒 Secure 256-bit SSL Encryption
        </span>

        <b>•</b>

        <span>
          Privacy Policy
        </span>

        <b>•</b>

        <span>
          Terms of Service
        </span>

      </div> */}

    </div>
  );
}

export default Login;
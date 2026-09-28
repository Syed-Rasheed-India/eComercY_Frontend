import { useState } from "react";
import "../styles/Register.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle registration
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");

    // Check terms
    if (!agree) {
      setMessage(
        "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    // Check passwords
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Send only the fields required by backend
      const response = await fetch(
        "https://ecomercy-backend.onrender.com/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      // Read response safely
      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Server returned an invalid response"
        );
      }

      console.log("Register response:", data);

      // Backend returned an error
      if (!response.ok) {
        setMessage(
          data.message || "Registration failed"
        );
        return;
      }

      // Registration successful
      setMessage(
        data.message || "Registration successful"
      );

      // Your backend registration response currently
      // returns user information, not a JWT token.
      console.log("Registered user:", data.user);

      // Go to login page
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* Top Icon */}
        <div className="register-icon">
          <User
            size={18}
            strokeWidth={2.5}
          />
        </div>

        {/* Heading */}
        <h1>Create an Account</h1>

        <p className="subtitle">
          Simple shopping. Better experience.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">

            <label>
              Full Name
            </label>

            <div className="input-wrapper">

              <User size={13} />

              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Email */}
          <div className="form-group">

            <label>
              Email Address
            </label>

            <div className="input-wrapper">

              <Mail size={13} />

              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Password */}
          <div className="form-group">

            <label>
              Password
            </label>

            <div className="input-wrapper">

              <Lock size={13} />

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Confirm Password */}
          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <div className="input-wrapper">

              <Lock size={13} />

              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Terms */}
          <div className="terms">

            <input
              type="checkbox"
              checked={agree}
              onChange={(e) =>
                setAgree(e.target.checked)
              }
              id="terms"
            />

            <label htmlFor="terms">

              I agree to the{" "}

              <span>
                Terms of Service
              </span>

              {" "}and{" "}

              <span>
                Privacy Policy
              </span>

            </label>

          </div>


          {/* Message */}
          {message && (
            <p className="register-message">
              {message}
            </p>
          )}


          {/* Submit */}
          <button
            type="submit"
            className="create-btn"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"
            }

            {!loading && (
              <span>→</span>
            )}

          </button>

        </form>


        {/* Login */}
        <div className="login-text">

          Already have an account?{" "}

          <NavLink to="/login">
            Login
          </NavLink>

        </div>

      </div>

    </div>
  );
}

export default Register;
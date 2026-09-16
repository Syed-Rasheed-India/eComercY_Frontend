import { useState } from "react";
import '../styles/Register.css'
import { NavLink } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
} from "lucide-react";
// import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    let response = await fetch('http://localhost:3000/register',{
        method:'POST',
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(formData)
    })

    let data = await response.json();

       localStorage.setItem("token", data.token);

        console.log("Token:", data.token);

        // Optional: check it
        console.log(
            "Stored token:",
            localStorage.getItem("token")
        );
    console.log(data)
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* Top Icon */}
        <div className="register-icon">
          <User size={18} strokeWidth={2.5} />
        </div>

        {/* Heading */}
        <h1>Create an Account</h1>
        <p className="subtitle">
          Simple shopping. Better experience.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>

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
            <label>Email Address</label>

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
            <label>Password</label>

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
            <label>Confirm Password</label>

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
              onChange={(e) => setAgree(e.target.checked)}
              id="terms"
            />

            <label htmlFor="terms">
              I agree to the{" "}
              <span>Terms of Service</span> and{" "}
              <span>Privacy Policy</span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="create-btn">
            Create Account
            <span>→</span>
          </button>
        </form>

        {/* Login */}
        <div className="login-text">
          Already have an account?
          <NavLink to="/login">Login</NavLink>
        </div>

      </div>

      

    </div>
  );
}

export default Register;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful ✅");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    // Improvement 1: Vertically center the card in the viewport
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="mb-3 text-center">Login</h3>
        <form onSubmit={handleSubmit}>
          {/* Improvement 2: Add an icon to the email field for consistency */}
          <div className="mb-3">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Password</label>
            <div className="input-group">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"  
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setPasswordVisible(!isPasswordVisible)}
              >
                <i className={`bi ${isPasswordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>
          
          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
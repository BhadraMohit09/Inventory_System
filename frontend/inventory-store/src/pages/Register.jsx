import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const navigate = useNavigate();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password, role });
      toast.success("Registration successful ✅ Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="mb-3 text-center">Create Account</h3>
        <form onSubmit={handleSubmit}>
          {/* Name, Email, and Password fields remain the same... */}
          <div className="mb-3">
            <label>Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label>Email</label>
            <div className="input-group">
               <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label>Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-key"></i></span>
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          {/* --- Updated Role Selection --- */}
          <div className="mb-4">
            <label className="form-label d-block">Role</label>
            <div className="btn-group w-100" role="group">
              {/* Staff Button */}
              <input
                type="radio"
                className="btn-check"
                name="role"
                id="roleStaff"
                value="staff"
                checked={role === "staff"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="btn btn-outline-primary w-50" htmlFor="roleStaff">
                Staff
              </label>

              {/* Admin Button */}
              <input
                type="radio"
                className="btn-check"
                name="role"
                id="roleAdmin"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="btn btn-outline-primary w-50" htmlFor="roleAdmin">
                Admin
              </label>
            </div>
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Register
          </button>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
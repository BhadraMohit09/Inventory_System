import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react"; // 1. Import useRef

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // 2. Create a ref for the toggler button
  const togglerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 3. Create a function to close the navbar
  const handleNavCollapse = () => {
    // Check if the toggler exists and is not hidden
    if (togglerRef.current && togglerRef.current.offsetParent !== null) {
      togglerRef.current.click();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg p-3 navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Inventory App</Link>

        {!isAuthPage && token && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              ref={togglerRef} // 4. Attach the ref to the button
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  {/* 5. Add onClick to each nav link */}
                  <Link className="nav-link" to="/dashboard" onClick={handleNavCollapse}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products" onClick={handleNavCollapse}>Products</Link>

                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stock" onClick={handleNavCollapse}>Stock</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/change-password" onClick={handleNavCollapse}>Change Password</Link>
                </li>
              </ul>
              <button className="btn btn-danger" onClick={() => {
                handleNavCollapse(); // Also close on logout
                handleLogout();
              }}>Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
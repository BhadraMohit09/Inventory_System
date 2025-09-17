import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // State for each password field's visibility
  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("❌ New passwords do not match");
      return;
    }

    try {
      await API.put("/auth/change-password", { oldPassword, newPassword });
      toast.success("✅ Password changed successfully");
      
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to change password");
    }
  };

  return (
    <div className="card p-4 mx-auto mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3 text-center">Change Password</h3>
      <form onSubmit={handleSubmit}>

        {/* --- Updated JSX using Bootstrap Input Groups --- */}

        <div className="mb-3">
          <label>Current Password</label>
          <div className="input-group">
            <input
              type={isOldPasswordVisible ? "text" : "password"}
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            {/* Wrap icon in a span with 'input-group-text' */}
            <span 
              className="input-group-text" 
              style={{ cursor: "pointer" }}
              onClick={() => setOldPasswordVisible(!isOldPasswordVisible)}
            >
              <i className={`bi ${isOldPasswordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label>New Password</label>
           <div className="input-group">
            <input
              type={isNewPasswordVisible ? "text" : "password"}
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span 
              className="input-group-text" 
              style={{ cursor: "pointer" }}
              onClick={() => setNewPasswordVisible(!isNewPasswordVisible)}
            >
              <i className={`bi ${isNewPasswordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label>Confirm New Password</label>
          <div className="input-group">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span 
              className="input-group-text" 
              style={{ cursor: "pointer" }}
              onClick={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
            >
              <i className={`bi ${isConfirmPasswordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Update Password
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
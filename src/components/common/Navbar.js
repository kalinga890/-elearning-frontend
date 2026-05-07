import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          📚 ELearn
        </Link>

        {/* Desktop Nav Links */}
        <div style={styles.navLinks}>
          <Link to="/courses" style={styles.navLink}>
            Courses
          </Link>

          {currentUser && userProfile?.role === "INSTRUCTOR" && (
            <Link to="/instructor" style={styles.navLink}>
              My Courses
            </Link>
          )}

          {currentUser && userProfile?.role === "STUDENT" && (
            <Link to="/dashboard" style={styles.navLink}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={styles.authButtons}>
          {currentUser ? (
            <div style={styles.userSection}>
              <div style={styles.avatar}>
                {userProfile?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span style={styles.userName}>
                {userProfile?.name?.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={styles.guestButtons}>
              <Link to="/login" style={styles.loginBtn}>
                Login
              </Link>
              <Link to="/register" style={styles.registerBtn}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: "white",
    boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#667eea",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  navLink: {
    color: "#555",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  authButtons: {
    display: "flex",
    alignItems: "center",
  },
  guestButtons: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  loginBtn: {
    padding: "8px 20px",
    border: "2px solid #667eea",
    borderRadius: "8px",
    color: "#667eea",
    fontWeight: "600",
    fontSize: "14px",
    textDecoration: "none",
  },
  registerBtn: {
    padding: "8px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    textDecoration: "none",
    border: "none",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
  },
  userName: {
    fontWeight: "600",
    color: "#333",
    fontSize: "15px",
  },
  logoutBtn: {
    padding: "7px 16px",
    background: "transparent",
    border: "2px solid #ff4757",
    borderRadius: "8px",
    color: "#ff4757",
    fontWeight: "600",
    fontSize: "13px",
  },
};

export default Navbar;
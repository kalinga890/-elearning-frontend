import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { profile } = await register(email, password, name, role);
      toast.success("Account created successfully!");

      // Use profile role for redirect
      const userRole = profile?.role || role;
      if (userRole === "INSTRUCTOR") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      await loginWithGoogle(formData.role);
      toast.success("Account created!");
      navigate(
        formData.role === "INSTRUCTOR" ? "/instructor" : "/dashboard"
      );
    } catch (error) {
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoText}>📚 ELearn</span>
        </div>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join thousands of learners today</p>

        {/* Role Selector */}
        <div style={styles.roleContainer}>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, role: "STUDENT" })
            }
            style={{
              ...styles.roleButton,
              ...(formData.role === "STUDENT"
                ? styles.roleButtonActive
                : {}),
            }}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, role: "INSTRUCTOR" })
            }
            style={{
              ...styles.roleButton,
              ...(formData.role === "INSTRUCTOR"
                ? styles.roleButtonActive
                : {}),
            }}
          >
            👨‍🏫 Instructor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          style={styles.googleButton}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: 18, marginRight: 8 }}
          />
          Sign up with Google
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  logo: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#667eea",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "8px",
    color: "#1a1a2e",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "24px",
    fontSize: "14px",
  },
  roleContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  roleButton: {
    flex: 1,
    padding: "10px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    background: "white",
    fontSize: "14px",
    fontWeight: "600",
    color: "#666",
  },
  roleButtonActive: {
    border: "2px solid #667eea",
    background: "#f0f0ff",
    color: "#667eea",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    padding: "13px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "8px",
  },
  divider: {
    textAlign: "center",
    margin: "20px 0",
    position: "relative",
    borderTop: "1px solid #e1e5e9",
  },
  dividerText: {
    background: "white",
    padding: "0 12px",
    color: "#999",
    fontSize: "13px",
    position: "relative",
    top: "-10px",
  },
  googleButton: {
    width: "100%",
    padding: "12px",
    background: "white",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
    fontSize: "14px",
  },
  link: {
    color: "#667eea",
    fontWeight: "600",
  },
};

export default Register;
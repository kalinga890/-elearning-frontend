import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { profile } = await login(email, password);
      toast.success("Welcome back!");
      // Redirect based on role
      if (profile?.role === "INSTRUCTOR") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { profile } = await loginWithGoogle();
      toast.success("Welcome!");
      if (profile?.role === "INSTRUCTOR") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoText}>📚 ELearn</span>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue learning</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={styles.googleButton}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: 18, marginRight: 8 }}
          />
          Continue with Google
        </button>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
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
    marginBottom: "24px",
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
    marginBottom: "32px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
    cursor: "pointer",
  },
  divider: {
    textAlign: "center",
    margin: "24px 0",
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
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    color: "#666",
    fontSize: "14px",
  },
  link: {
    color: "#667eea",
    fontWeight: "600",
  },
};

export default Login;
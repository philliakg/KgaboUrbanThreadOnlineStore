import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/Login.css";

function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/shop";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch {
      setError("Failed to log in. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    try {
      await loginWithGoogle();
      navigate(redirectTo);
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to keep shopping.</p>

        {error && <p className="auth-error">{error}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Log In"}
        </button>

        <button
          type="button"
          className="auth-google"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p className="auth-switch">
          No account yet?{" "}
          <Link to="/register" state={location.state}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

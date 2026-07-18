import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import CountrySelect from "../components/ui/CountrySelect";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Logo from "../components/ui/Logo";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!country) {
      setError("Please select your country.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, fullName, country });
      navigate("/home");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Logo size={48} showText={true} />
        <div style={styles.tagline}>Secure Crypto Exchange</div>
      </div>

      <Card>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join SafeTrade today</p>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <PasswordInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && (
              <div style={styles.mismatch}>Passwords do not match.</div>
            )}
          </div>

          <CountrySelect value={country} onChange={(e) => setCountry(e.target.value)} />

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.checkboxLabel}>
              I agree to the <a href="/terms" style={styles.link}>Terms of Service</a>
            </span>
          </label>

          {error && <div style={styles.errorText}>{error}</div>}

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p style={styles.loginPrompt}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a0e1a 0%, #131b2e 100%)",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 28,
  },
  tagline: {
    color: "#8b93a7",
    fontSize: 14,
    marginTop: 6,
  },
  title: {
    color: "#e5e7eb",
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    margin: 0,
  },
  subtitle: {
    color: "#8b93a7",
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  mismatch: {
    color: "#ff4d4f",
    fontSize: 13,
    marginTop: -8,
    marginBottom: 16,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: "#6c5ce7",
  },
  checkboxLabel: {
    color: "#c5c9d6",
    fontSize: 14,
  },
  link: {
    color: "#7c6cf5",
    fontWeight: 600,
    textDecoration: "none",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  loginPrompt: {
    color: "#8b93a7",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
};

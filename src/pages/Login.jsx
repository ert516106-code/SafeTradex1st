import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import Logo from "../components/ui/Logo";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailValid = EMAIL_REGEX.test(email);

  const formValid =
    emailValid &&
    password.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!formValid) return;

    try {
      setLoading(true);

      await login(
        email.trim(),
        password
      );

      navigate("/home", {
        replace: true,
      });

    } catch (err) {
      setError(
        err.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #18254b 0%, #050816 70%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <Logo />
        </div>

        <Card>

          <h2
            style={{
              color: "#fff",
              marginTop: 0,
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "28px",
              textAlign: "center",
            }}
          >
            Sign in to your SafeTrade account
          </p>

          <form onSubmit={handleSubmit}>

            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            {!emailValid &&
              email.length > 0 && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "18px",
                  }}
                >
                  Please enter a valid email.
                </p>
              )}

            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: "#6d5dff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div
                style={{
                  background: "#2b0d14",
                  color: "#ff6b6b",
                  padding: "12px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={!formValid || loading}
            >
              {loading ? "Signing In..." : "Login"}
            </Button>

          </form>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "15px",
            }}
          >
            Don't have an account?{" "}

            <Link
              to="/register"
              style={{
                color: "#6d5dff",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Create Account
            </Link>
          </div>

        </Card>
      </div>
    </div>
  );
}
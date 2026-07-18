import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import Logo from "../components/ui/Logo";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import PasswordStrength from "../components/ui/PasswordStrength";
import CountrySelect from "../components/ui/CountrySelect";
import Button from "../components/ui/Button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [country, setCountry] = useState("");

  const [acceptTerms, setAcceptTerms] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const emailValid = EMAIL_REGEX.test(email);

  const passwordStrength = (() => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4)
      return "Medium";

    return "Strong";
  })();

  const passwordsMatch =
    password === confirmPassword &&
    confirmPassword.length > 0;

  const canRegister =
    fullName.trim() !== "" &&
    emailValid &&
    passwordStrength === "Strong" &&
    passwordsMatch &&
    country &&
    acceptTerms;

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Register button clicked");

    if (!canRegister) return;

    try {
      setLoading(true);
      setError("");

      await register({
        fullName,
        email,
        password,
      });

      await login(email, password);

      navigate("/home", {
        replace: true,
      });

    } catch (err) {
      setError(
        err.message ||
          "Unable to create account."
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
          "radial-gradient(circle at top,#18254b 0%,#050816 70%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <Logo />
        </div>

        <Card>

          <h2
            style={{
              color: "#fff",
              textAlign: "center",
              marginTop: 0,
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              color: "#94a3b8",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            Join SafeTrade today
          </p>

          <form onSubmit={handleSubmit}>

            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
            />

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
            />
                        <PasswordStrength
              password={password}
            />

            <PasswordInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            {confirmPassword.length > 0 &&
              !passwordsMatch && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "18px",
                  }}
                >
                  Passwords do not match.
                </p>
              )}

            <CountrySelect
              value={country}
              onChange={(value) =>
                setCountry(value)
              }
            />

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                color: "#cbd5e1",
                fontSize: "14px",
                marginTop: "18px",
                marginBottom: "24px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) =>
                  setAcceptTerms(
                    e.target.checked
                  )
                }
                style={{
                  marginTop: "3px",
                }}
              />

              <span>
                I agree to the
                {" "}
                <Link
                  to="/terms"
                  style={{
                    color: "#6d5dff",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Terms of Service
                </Link>
              </span>
            </label>

            {error && (
              <div
                style={{
                  background: "#2b0d14",
                  color: "#ff6b6b",
                  padding: "14px",
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
              disabled={
                !canRegister ||
                loading
              }
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
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
            Already have an account?{" "}

            <Link
              to="/login"
              style={{
                color: "#6d5dff",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Login
            </Link>
          </div>

        </Card>
      </div>
    </div>
  );
}

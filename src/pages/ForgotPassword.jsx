import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Logo from "../components/ui/Logo";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldLabelStyle = {
  display: "block",
  color: "#B4BBD6",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
};

const fieldErrorStyle = {
  color: "#FF5C6C",
  fontSize: 12,
  marginTop: -10,
  marginBottom: 16,
};

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!isEmailValid) {
      setTouched(true);
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background:
          "linear-gradient(180deg, #0B0E1A 0%, #131A2E 45%, #1C1440 100%)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Logo />
      </div>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <Card>
          {!submitted ? (
            <>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: 24,
                  fontWeight: 700,
                  margin: 0,
                  marginBottom: 4,
                  textAlign: "center",
                }}
              >
                Forgot Password
              </h1>
              <p
                style={{
                  color: "#8A93B8",
                  fontSize: 14,
                  textAlign: "center",
                  margin: 0,
                  marginBottom: 24,
                  lineHeight: 1.5,
                }}
              >
                Enter the email associated with your account and we'll send
                you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <label style={fieldLabelStyle}>Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouched(true);
                  }}
                  placeholder="you@example.com"
                />
                {touched && !isEmailValid && (
                  <p style={fieldErrorStyle}>Please enter a valid email</p>
                )}

                {formError && (
                  <p
                    style={{
                      color: "#FF5C6C",
                      fontSize: 13,
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    {formError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={!isEmailValid}
                  loading={submitting}
                  fullWidth
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Check Your Email
              </h1>
              <p
                style={{
                  color: "#8A93B8",
                  fontSize: 14,
                  lineHeight: 1.5,
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                We've sent a password reset link to:
              </p>
              <p
                style={{
                  color: "#8C7CFF",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                {email}
              </p>
              <Button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setTouched(false);
                }}
                fullWidth
              >
                Send Another Link
              </Button>
            </div>
          )}

          <p
            style={{
              color: "#8A93B8",
              fontSize: 14,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Remembered your password?{" "}
            <Link
              to="/login"
              style={{
                color: "#8C7CFF",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
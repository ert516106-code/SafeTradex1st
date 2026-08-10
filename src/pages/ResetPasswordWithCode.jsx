import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Card from "../components/ui/Card";
import Logo from "../components/ui/Logo";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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

export default function ResetPasswordWithCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefillEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(prefillEmail ? "code" : "email"); // 'email' | 'code' | 'password' | 'done'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSendCode(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setStep("code");
    } catch (err) {
      setError(err.message || "Could not send code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      });
      if (verifyError) throw verifyError;
      setStep("password");
    } catch (err) {
      setError(err.message || "That code is invalid or expired. You can try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetPassword(e) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      setStep("done");
    } catch (err) {
      setError(err.message || "Could not set your new password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
          {step === "email" && (
            <>
              <h1 style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4, textAlign: "center" }}>
                Reset Your Password
              </h1>
              <p style={{ color: "#8A93B8", fontSize: 14, textAlign: "center", margin: 0, marginBottom: 24, lineHeight: 1.5 }}>
                Enter your email and we'll send you a verification code.
              </p>
              <form onSubmit={handleSendCode} noValidate>
                <label style={fieldLabelStyle}>Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {error && <p style={fieldErrorStyle}>{error}</p>}
                <Button type="submit" loading={submitting} fullWidth>
                  Send Code
                </Button>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <h1 style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4, textAlign: "center" }}>
                Enter Verification Code
              </h1>
              <p style={{ color: "#8A93B8", fontSize: 14, textAlign: "center", margin: 0, marginBottom: 8, lineHeight: 1.5 }}>
                We sent a 6-digit code to:
              </p>
              <p style={{ color: "#8C7CFF", fontSize: 15, fontWeight: 600, margin: 0, marginBottom: 24, textAlign: "center" }}>
                {email}
              </p>
              <form onSubmit={handleVerifyCode} noValidate>
                <label style={fieldLabelStyle}>Verification Code</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                />
                {error && <p style={fieldErrorStyle}>{error}</p>}
                <Button type="submit" loading={submitting} fullWidth>
                  Verify Code
                </Button>
              </form>
              <p style={{ color: "#8A93B8", fontSize: 13, textAlign: "center", marginTop: 16 }}>
                Didn't get it?{" "}
                <button
                  type="button"
                  onClick={handleSendCode}
                  style={{ color: "#8C7CFF", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
                >
                  Resend code
                </button>
              </p>
            </>
          )}

          {step === "password" && (
            <>
              <h1 style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4, textAlign: "center" }}>
                Set New Password
              </h1>
              <p style={{ color: "#8A93B8", fontSize: 14, textAlign: "center", margin: 0, marginBottom: 24, lineHeight: 1.5 }}>
                Choose a new password for your account.
              </p>
              <form onSubmit={handleSetPassword} noValidate>
                <label style={fieldLabelStyle}>New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
                <label style={fieldLabelStyle}>Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                />
                {error && <p style={fieldErrorStyle}>{error}</p>}
                <Button type="submit" loading={submitting} fullWidth>
                  Set New Password
                </Button>
              </form>
            </>
          )}

          {step === "done" && (
            <div style={{ textAlign: "center" }}>
              <h1 style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 12 }}>
                Password Updated
              </h1>
              <p style={{ color: "#8A93B8", fontSize: 14, lineHeight: 1.5, margin: 0, marginBottom: 24 }}>
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <Button type="button" onClick={() => navigate("/login")} fullWidth>
                Back to Login
              </Button>
            </div>
          )}

          {step !== "done" && (
            <p style={{ color: "#8A93B8", fontSize: 14, textAlign: "center", marginTop: 20 }}>
              Remembered your password?{" "}
              <Link to="/login" style={{ color: "#8C7CFF", fontWeight: 600, textDecoration: "none" }}>
                Login
              </Link>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

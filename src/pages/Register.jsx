import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Globe,
} from "lucide-react";

import { registerUser, loginUser } from "../lib/authService";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [country, setCountry] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [referralCode, setReferralCode] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRegister = async () => {
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        fullName,
        country,
        email,
        password,
        referralCode,
      });

      await loginUser(email, password);

      navigate("/home", {
        replace: true,
      });

    } catch (err) {
  console.error("Register Error:", err);

  setError(
    err?.message ||
    JSON.stringify(err) ||
    "Registration failed."
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex justify-center px-6 py-10">

  <div className="w-full max-w-md">

    {step === 1 && (
      <>

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Create your account
          </h1>

          <p className="text-slate-400 mt-3">
            Select your Country / Region.
          </p>

        </div>

        <div className="rounded-3xl bg-[#0C1828] border border-slate-800 p-6">

          <label className="font-medium">
            Country / Region
          </label>

          <div className="relative mt-3">

            <Globe
              className="absolute left-4 top-4 text-slate-400"
              size={18}
            />

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-4"
            >
              <option value="">Select Country</option>

              <option>Philippines</option>
              <option>Singapore</option>
              <option>Japan</option>
              <option>South Korea</option>
              <option>Hong Kong</option>
              <option>United Arab Emirates</option>
              <option>Switzerland</option>
              <option>Australia</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Canada</option>

            </select>

          </div>

          <div className="flex gap-3 mt-6">

            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />

            <p className="text-sm text-slate-400">
              I agree to the Terms of Service and Privacy Policy.
            </p>

          </div>

          <button
            disabled={!country || !accepted}
            onClick={() => setStep(2)}
            className="w-full h-12 rounded-xl mt-8 bg-gradient-to-r from-sky-500 to-blue-600 disabled:opacity-40 font-semibold"
          >
            Continue
          </button>

        </div>

      </>
    )}

    {step === 2 && (
      <>

        <button
          onClick={() => setStep(1)}
          className="text-sky-400 mb-6"
        >
          ← Back
        </button>

        <div className="rounded-3xl bg-[#0C1828] border border-slate-800 p-6 space-y-5">

          <div>

            <label>Full Name</label>

            <div className="relative mt-2">

              <User
                className="absolute left-4 top-4 text-slate-400"
                size={18}
              />

              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-4"
              />

            </div>

          </div>

          <div>

            <label>Email</label>

            <div className="relative mt-2">

              <Mail
                className="absolute left-4 top-4 text-slate-400"
                size={18}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-4"
              />

            </div>

          </div>

          <div>

            <label>Password</label>

            <div className="relative mt-2">

              <Lock
                className="absolute left-4 top-4 text-slate-400"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

          <div>

            <label>Confirm Password</label>

            <div className="relative mt-2">

              <Lock
                className="absolute left-4 top-4 text-slate-400"
                size={18}
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

          <div>

            <label>
              Referral Code
              <span className="text-slate-500 ml-2 text-sm">
                (Optional)
              </span>
            </label>

            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Referral Code"
              className="w-full mt-2 h-12 rounded-xl bg-[#101E31] border border-slate-700 px-4"
            />

          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500 p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            onClick={handleRegister}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </div>

      </>
    )}

  </div>

</div>
);
}

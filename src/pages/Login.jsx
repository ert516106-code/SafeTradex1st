import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { loginUser, getProfile } from "../lib/authService";
import { useAuth } from "../lib/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(
        email,
        password
      );

      const user = result.user;

      if (!user) {
        throw new Error(
          "Unable to sign in."
        );
      }

      const profile = await getProfile(
        user.id
      );

      await refreshProfile();

      if (profile.role === "admin") {
        navigate("/admin");
        return;
      }

      if (
        profile.status === "Pending"
      ) {
        navigate(
          "/pending-approval"
        );
        return;
      }

      navigate("/home");

    } catch (err) {
      setError(
        err.message ||
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex justify-center items-center px-6">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-slate-400 mt-3">
            Sign in to your SafeTradex account.
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-3xl bg-[#0C1828] border border-slate-800 p-6 space-y-5"
        >

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
                onChange={(e)=>
                  setEmail(e.target.value)
                }
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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e)=>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-12"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-3"
              >
                {showPassword
                  ? <EyeOff size={18}/>
                  : <Eye size={18}/>}
              </button>

            </div>

          </div>
                    {error && (
            <div className="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-sky-400 hover:text-sky-300"
            >
              Forgot Password?
            </Link>
          </div>

        </form>

        <div className="mt-8 text-center text-slate-400">

          Don't have an account?

          <Link
            to="/register"
            className="ml-2 text-sky-400 hover:text-sky-300 font-medium"
          >
            Create one
          </Link>

        </div>

      </div>

    </div>
  );
}

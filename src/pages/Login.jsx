import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../lib/AuthContext"; // IMPORTANT

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // IMPORTANT

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const userData = {
        email,
        loggedIn: true,
        role: "user"
      };

      // ✅ THIS is the important fix
      login(userData);

      // optional backup persistence
      localStorage.setItem("user", JSON.stringify(userData));

      setLoading(false);

      // ✅ go to HOME page (NOT "/")
      navigate("/home", { replace: true });
    }, 800);
  };

  const handleGoogleLogin = () => {
    const userData = {
      email: "googleuser@gmail.com",
      loggedIn: true,
      role: "user"
    };

    login(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-[380px] bg-white border rounded-2xl p-8 shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <Mail className="absolute left-3 top-4 w-4 h-4 text-gray-400" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border h-12 rounded-xl pl-10 pr-4"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-4 w-4 h-4 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border h-12 rounded-xl pl-10 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-black text-white"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <div className="mt-5 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

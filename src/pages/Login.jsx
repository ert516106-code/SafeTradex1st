import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [loading,setLoading]=useState(false);

  const handleSubmit=(e)=>{
    e.preventDefault();

    if(!email || !password){
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    setTimeout(()=>{

      // Temporary login session
      localStorage.setItem(
        "user",
        JSON.stringify({
          email:email,
          loggedIn:true
        })
      );

      setLoading(false);

      // Change "/" if your dashboard route is different
      navigate("/");

    },1000);

  };

  const handleGoogleLogin=()=>{

    // Temporary Google login simulation
    localStorage.setItem(
      "user",
      JSON.stringify({
        email:"googleuser@gmail.com",
        loggedIn:true
      })
    );

    navigate("/");
  };

  return(
    <div className="min-h-screen flex justify-center items-center bg-[#0b1025] relative overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px]" />

      <div className="w-[380px] bg-[#11152c]/90 backdrop-blur-xl border border-[#4f46e520] rounded-3xl p-8 text-white relative shadow-2xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Login to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div className="relative">

            <Mail className="absolute left-3 top-4 w-4 h-4 text-gray-400"/>

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Your e-mail address"
              className="w-full bg-[#1d2240] h-12 rounded-xl pl-10 pr-4 outline-none border border-gray-700"
            />

          </div>

          <div className="relative">

            <Lock className="absolute left-3 top-4 w-4 h-4 text-gray-400"/>

            <input
              type={showPassword ? "text":"password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#1d2240] h-12 rounded-xl pl-10 pr-10 outline-none border border-gray-700"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-4"
            >
              {showPassword ?
                <EyeOff size={16}/> :
                <Eye size={16}/>
              }
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold disabled:opacity-50"
          >

            {loading ? "Signing in..." : "Login"}

          </button>

        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-700"/>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-700"/>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-xl border border-gray-700 flex items-center justify-center gap-3 hover:bg-[#1d2240]"
        >
          <img
            src="https://www.google.com/favicon.ico"
            width="20"
            alt=""
          />

          Continue with Google

        </button>

        <div className="mt-6 text-center text-sm text-gray-400">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-indigo-400"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}

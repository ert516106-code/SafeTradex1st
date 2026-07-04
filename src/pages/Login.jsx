import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const navigate = useNavigate();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [loading,setLoading]=useState(false);

  const handleSubmit=(e)=>{
    e.preventDefault();

    setLoading(true);

    setTimeout(()=>{
      setLoading(false);
      navigate("/");
    },1000);
  };

  return(
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue"
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary"
          >
            Register
          </Link>
        </>
      }
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div>
          <Label>Email</Label>

          <div className="relative">

            <Mail className="absolute left-3 top-4 w-4 h-4"/>

            <Input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10"
              required
            />

          </div>
        </div>

        <div>

          <Label>Password</Label>

          <div className="relative">

            <Lock className="absolute left-3 top-4 w-4 h-4"/>

            <Input
              type={showPassword ? "text":"password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-4"
            >
              {showPassword
              ? <EyeOff size={16}/>
              : <Eye size={16}/>}
            </button>

          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-primary"
          >
            Forgot Password?
          </Link>
        </div>

      </form>

    </AuthLayout>
  );
}

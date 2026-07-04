import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
  UserPlus,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pw) => {
    let score = 0;

    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 2) {
      return {
        label: "Weak",
        color: "bg-red-500",
        width: "33%"
      };
    }

    if (score <= 4) {
      return {
        label: "Medium",
        color: "bg-yellow-500",
        width: "66%"
      };
    }

    return {
      label: "Strong",
      color: "bg-green-500",
      width: "100%"
    };
  };

  const passwordStrength = password
    ? getPasswordStrength(password)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create Account"
      subtitle="Sign up to continue"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary"
          >
            Login
          </Link>
        </>
      }
    >

      {error && (
        <div className="p-3 mb-4 rounded bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div>
          <Label>Email</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-4 w-4 h-4" />

            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
              required
            />
          </div>
        </div>

        <div>
          <Label>Password</Label>

          <div className="relative">

            <Lock className="absolute left-3 top-4 w-4 h-4"/>

            <Input
              type={
                showPassword
                ? "text"
                : "password"
              }
              className="pl-10 pr-10"
              value={password}
              onChange={(e)=>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="button"
              className="absolute right-3 top-4"
              onClick={()=>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? <EyeOff size={16}/>
                : <Eye size={16}/>
              }
            </button>

          </div>

          {passwordStrength && (
            <div className="mt-2">

              <div className="w-full h-2 bg-gray-200 rounded">

                <div
                  className={`h-2 ${passwordStrength.color}`}
                  style={{
                    width:passwordStrength.width
                  }}
                />

              </div>

              <p className="text-xs mt-1">
                {passwordStrength.label}
              </p>

            </div>
          )}

        </div>

        <div>

          <Label>Confirm Password</Label>

          <div className="relative">

            <Lock className="absolute left-3 top-4 w-4 h-4"/>

            <Input
              type={
                showConfirmPassword
                ? "text"
                : "password"
              }
              className="pl-10 pr-10"
              value={confirmPassword}
              onChange={(e)=>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
            />

            <button
              type="button"
              className="absolute right-3 top-4"
              onClick={()=>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? <EyeOff size={16}/>
                : <Eye size={16}/>
              }
            </button>

          </div>

        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >

          {loading
            ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                Creating...
              </>
            )
            : "Create Account"
          }

        </Button>

      </form>

    </AuthLayout>
  );
}

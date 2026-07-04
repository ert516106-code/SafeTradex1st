import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Loader2, ArrowLeft } from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <AuthLayout
      icon={Lock}
      title="Create New Password"
      subtitle="Enter your new password"

      footer={
        <Link
          to="/login"
          className="text-primary font-medium"
        >
          <ArrowLeft className="w-3 h-3 inline mr-1" />
          Back to Login
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">

          <Label htmlFor="password">
            New Password
          </Label>

          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
            placeholder="Enter new password"
            required
          />

        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>

      </form>
    </AuthLayout>
  );
}

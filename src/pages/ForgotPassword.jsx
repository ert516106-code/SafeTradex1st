import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Fake loading delay
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Reset Password"
      subtitle="We'll send you a reset link"

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
      {sent ? (
        <p className="text-center text-sm">
          Reset request sent successfully.
        </p>
      ) : (

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div className="space-y-2">

            <Label htmlFor="email">
              Email
            </Label>

            <div className="relative">

              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e)=>
                  setEmail(e.target.value)
                }
                className="pl-10 h-12"
                required
              />

            </div>

          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}

          </Button>

        </form>

      )}

    </AuthLayout>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Logo from "../components/ui/Logo";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      // Show splash for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/home", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="text-center">

        <div className="flex justify-center">
          <Logo size={120} showText={false} />
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: "800",
            marginTop: "25px",
            color: "#ffffff",
            letterSpacing: "-2px",
          }}
        >
          Safe
          <span style={{ color: "#6d5dff" }}>Trade</span>
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "10px",
            fontSize: "18px",
          }}
        >
          Secure Crypto Trading Platform
        </p>

        <div
          style={{
            margin: "45px auto 0",
            width: "55px",
            height: "55px",
            border: "4px solid rgba(109,93,255,.2)",
            borderTop: "4px solid #6d5dff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />

      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
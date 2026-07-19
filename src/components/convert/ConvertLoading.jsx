import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinLogo, computeQuote, useConvert } from "../../pages/Convert";

const STEPS = ["Fetching best rate...", "Locking exchange rate...", "Confirming conversion...", "Finalizing..."];
const STEP_MS = 700;

export default function ConvertLoading() {
  const navigate = useNavigate();
  const { draft } = useConvert();
  const [stepIndex, setStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const quote = useMemo(
    () => computeQuote(draft.fromCoin, draft.toCoin, draft.amount),
    [draft.fromCoin, draft.toCoin, draft.amount]
  );
  const { from, to } = quote;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, STEP_MS);
    const finish = setTimeout(() => {
      navigate("/convert/success", { replace: true });
    }, STEP_MS * STEPS.length + 300);
    return () => {
      clearInterval(interval);
      clearTimeout(finish);
    };
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <style>{`
        @keyframes cvOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cvOrbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes cvRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cvPulseCore {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.12); opacity: 1; }
        }
      `}</style>

      <div
        className="relative mb-10 flex h-40 w-40 items-center justify-center transition-opacity duration-500"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        {/* Outer rotating gradient ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #7C3AED, #2563EB, transparent 70%)",
            animation: "cvRingSpin 1.8s linear infinite",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
          }}
        />

        {/* Orbiting coin logos */}
        <div className="absolute inset-0" style={{ animation: "cvOrbit 2.6s linear infinite" }}>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <div style={{ animation: "cvOrbitReverse 2.6s linear infinite" }}>
              <CoinLogo coin={from} size={34} />
            </div>
          </div>
        </div>
        <div className="absolute inset-0" style={{ animation: "cvOrbit 2.6s linear infinite reverse" }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div style={{ animation: "cvOrbitReverse 2.6s linear infinite reverse" }}>
              <CoinLogo coin={to} size={34} />
            </div>
          </div>
        </div>

        {/* Core */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-[0_0_40px_rgba(124,58,237,0.6)]"
          style={{ animation: "cvPulseCore 1.6s ease-in-out infinite" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10l-3-3 3-3M4 7h11a4 4 0 014 4M17 14l3 3-3 3M20 17H9a4 4 0 01-4-4"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h1
        className="text-[19px] font-extrabold text-white transition-all duration-500"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)" }}
      >
        Converting {from.symbol} → {to.symbol}
      </h1>

      <p
        key={stepIndex}
        className="mt-3 text-[13.5px] text-[#A78BFA] transition-all duration-300"
        style={{ animation: "cvPulseCore 0.4s ease" }}
      >
        {STEPS[stepIndex]}
      </p>

      <div className="mt-8 flex gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i <= stepIndex ? 22 : 8,
              background: i <= stepIndex ? "linear-gradient(90deg, #7C3AED, #2563EB)" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

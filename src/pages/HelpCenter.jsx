import { ChevronRight, LifeBuoy } from "lucide-react";
import ProfilePageShell from "../components/profile/ProfilePageShell";

const faqs = [
  "How do I deposit funds?",
  "How long do withdrawals take?",
  "How do I enable Two-Factor Authentication?",
  "What are the trading fees?",
  "How do I verify my account?",
];

export default function HelpCenter() {
  return (
    <ProfilePageShell title="Help Center" subtitle="FAQs and support">
      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <LifeBuoy size={20} color="#60a5fa" />
        <div style={{ fontSize: 13, color: "#94a3b8" }}>
          Support is available 24/7. Browse common questions below.
        </div>
      </div>

      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          overflow: "hidden",
        }}
      >
        {faqs.map((q, idx) => (
          <div
            key={q}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: idx !== faqs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              fontSize: 13.5,
            }}
          >
            {q}
            <ChevronRight size={16} color="#475569" />
          </div>
        ))}
      </div>
    </ProfilePageShell>
  );
}

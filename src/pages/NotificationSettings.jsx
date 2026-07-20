import { useState } from "react";
import ProfilePageShell from "../components/profile/ProfilePageShell";

const initialToggles = [
  { key: "push", label: "Push Notifications", desc: "Deposits, withdrawals, price alerts" },
  { key: "email", label: "Email Notifications", desc: "Account and security updates" },
  { key: "sms", label: "SMS Alerts", desc: "Login and withdrawal confirmations" },
  { key: "promo", label: "Promotions", desc: "Offers and campaign updates" },
];

export default function NotificationSettings() {
  const [toggles, setToggles] = useState({ push: true, email: true, sms: false, promo: false });

  return (
    <ProfilePageShell title="Notifications" subtitle="Push, email, SMS">
      {initialToggles.map((item) => (
        <div
          key={item.key}
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.03)",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.desc}</div>
          </div>
          <button
            onClick={() => setToggles((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
            style={{
              width: 44,
              height: 26,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: toggles[item.key] ? "#3b82f6" : "rgba(255,255,255,0.12)",
              position: "relative",
              transition: "background 0.2s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: toggles[item.key] ? 22 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s ease",
              }}
            />
          </button>
        </div>
      ))}
    </ProfilePageShell>
  );
}

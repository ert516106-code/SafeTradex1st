import { ShieldCheck, KeyRound, Smartphone, Fingerprint, ChevronRight } from "lucide-react";
import ProfilePageShell from "../components/profile/ProfilePageShell";

const items = [
  { icon: KeyRound, label: "Change Password", desc: "Last changed 3 months ago" },
  { icon: Smartphone, label: "Two-Factor Authentication", desc: "Enabled via Authenticator App" },
  { icon: Fingerprint, label: "Biometric Login", desc: "Enabled on this device" },
  { icon: ShieldCheck, label: "Login Devices", desc: "2 active devices" },
];

export default function SecurityCenter() {
  return (
    <ProfilePageShell title="Security Center" subtitle="2FA, password, devices">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "rgba(16,185,129,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} color="#34d399" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
            <ChevronRight size={16} color="#475569" />
          </div>
        );
      })}
    </ProfilePageShell>
  );
}

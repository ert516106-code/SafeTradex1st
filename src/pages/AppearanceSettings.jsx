import { useState } from "react";
import { Check, Moon, Sun, Monitor } from "lucide-react";
import ProfilePageShell from "../components/profile/ProfilePageShell";

const options = [
  { key: "dark", label: "Dark", icon: Moon },
  { key: "light", label: "Light", icon: Sun },
  { key: "system", label: "System", icon: Monitor },
];

export default function AppearanceSettings() {
  const [selected, setSelected] = useState("dark");

  return (
    <ProfilePageShell title="Appearance" subtitle="Choose your theme">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.03)",
              padding: 16,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon size={18} color="#cbd5e1" />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{opt.label}</span>
            </div>
            {selected === opt.key && <Check size={16} color="#34d399" />}
          </button>
        );
      })}
    </ProfilePageShell>
  );
}

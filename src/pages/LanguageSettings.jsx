import { useState } from "react";
import { Check } from "lucide-react";
import ProfilePageShell from "../components/profile/ProfilePageShell";

const languages = ["English (US)", "Español", "Português", "Français", "Tiếng Việt", "中文"];

export default function LanguageSettings() {
  const [selected, setSelected] = useState("English (US)");

  return (
    <ProfilePageShell title="Language" subtitle="Choose your display language">
      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          overflow: "hidden",
        }}
      >
        {languages.map((lang, idx) => (
          <button
            key={lang}
            onClick={() => setSelected(lang)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              background: "transparent",
              border: "none",
              borderBottom: idx !== languages.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {lang}
            {selected === lang && <Check size={16} color="#34d399" />}
          </button>
        ))}
      </div>
    </ProfilePageShell>
  );
}

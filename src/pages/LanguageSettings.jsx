import { Check } from "lucide-react";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSettings() {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <ProfilePageShell
      title={t("profile.language.title")}
      subtitle={t("profile.language.subtitle")}
    >
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
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
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
            {lang.label}
            {language === lang.code && <Check size={16} color="#34d399" />}
          </button>
        ))}
      </div>
    </ProfilePageShell>
  );
}

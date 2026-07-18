import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  placeholder = "Password",
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const password = value || "";

  const checks = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "One number", test: (p) => /[0-9]/.test(p) },
    { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const passedCount = checks.filter((c) => c.test(password)).length;
  const strengthPct = Math.round((passedCount / checks.length) * 100);
  const strengthColor =
    strengthPct === 0 ? "#3a4054" : strengthPct <= 40 ? "#ff4d4f" : strengthPct <= 80 ? "#ffa940" : "#22c55e";
  const strengthLabel =
    strengthPct === 0 ? "" : strengthPct <= 40 ? "Weak" : strengthPct <= 80 ? "Medium" : "Strong";

  function handleBlur() {
    setTimeout(() => setFocused(false), 150);
  }

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: "16px" }}>
      {focused && (
        <div style={styles.bubble}>
          <div style={styles.strengthRow}>
            <span style={styles.strengthText}>
              Strength{strengthLabel ? `: ${strengthLabel}` : ""}
            </span>
            <span style={{ ...styles.strengthPct, color: strengthColor }}>
              {strengthPct}%
            </span>
          </div>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: `${strengthPct}%`,
                backgroundColor: strengthColor,
              }}
            />
          </div>

          <div style={styles.checklist}>
            {checks.map((c) => {
              const passed = c.test(password);
              return (
                <div key={c.label} style={styles.checkRow}>
                  <span
                    style={{
                      ...styles.iconCircle,
                      borderColor: passed ? "#22c55e" : "#4a5170",
                      backgroundColor: passed ? "#22c55e" : "transparent",
                    }}
                  >
                    {passed && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="#0d1226"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span style={{ color: passed ? "#e5e7eb" : "#9aa1b5", fontSize: 13 }}>
                    {c.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={styles.tip}>
            Avoid using a password you use on other sites, or one that's easy to guess.
          </div>

          <div style={styles.tail} />
        </div>
      )}

      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        style={{
          width: "100%",
          padding: "16px",
          paddingRight: "52px",
          background: "#0d1226",
          border: "1px solid #232b45",
          borderRadius: "16px",
          color: "#ffffff",
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
        style={{
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

const styles = {
  bubble: {
    position: "absolute",
    bottom: "calc(100% + 14px)",
    left: 0,
    right: 0,
    backgroundColor: "#131b30",
    border: "1px solid #232b45",
    borderRadius: 16,
    padding: "16px 18px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
    zIndex: 50,
  },
  tail: {
    position: "absolute",
    bottom: -8,
    left: 28,
    width: 16,
    height: 16,
    backgroundColor: "#131b30",
    borderRight: "1px solid #232b45",
    borderBottom: "1px solid #232b45",
    transform: "rotate(45deg)",
  },
  strengthRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: 600,
    color: "#e5e7eb",
  },
  strengthPct: {
    fontSize: 14,
    fontWeight: 700,
  },
  barTrack: {
    width: "100%",
    height: 5,
    borderRadius: 3,
    backgroundColor: "#232b45",
    overflow: "hidden",
    marginBottom: 14,
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.25s ease, background-color 0.25s ease",
  },
  checklist: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 12,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 16,
    height: 16,
    minWidth: 16,
    borderRadius: "50%",
    border: "2px solid #4a5170",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  tip: {
    fontSize: 12,
    color: "#9aa1b5",
    lineHeight: 1.4,
    borderTop: "1px solid #232b45",
    paddingTop: 10,
  },
};

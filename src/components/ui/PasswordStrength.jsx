import { useState, useRef } from "react";

export default function PasswordInput({ placeholder = "Password", value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef(null);

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
    // Small delay so a tap on the eye icon doesn't close the bubble first
    setTimeout(() => setFocused(false), 150);
  }

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", marginBottom: 16 }}>
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
                          stroke="#0d1424"
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

      <div style={styles.inputWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          style={styles.input}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          style={styles.eyeBtn}
          tabIndex={-1}
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 46px 16px 18px",
    borderRadius: 14,
    border: "1px solid #2a3149",
    backgroundColor: "#131b2e",
    color: "#e5e7eb",
    fontSize: 16,
    outline: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    padding: 0,
  },
  bubble: {
    position: "absolute",
    bottom: "calc(100% + 14px)",
    left: 0,
    right: 0,
    backgroundColor: "#1c2338",
    border: "1px solid #2f3854",
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
    backgroundColor: "#1c2338",
    borderRight: "1px solid #2f3854",
    borderBottom: "1px solid #2f3854",
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
    backgroundColor: "#2a3149",
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
    borderTop: "1px solid #2a3149",
    paddingTop: 10,
  },
};

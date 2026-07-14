export default function PasswordStrength({ password = "" }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;

  let strength = "Weak";
  let color = "#ef4444";

  if (passed >= 5) {
    strength = "Strong";
    color = "#22c55e";
  } else if (passed >= 3) {
    strength = "Medium";
    color = "#f59e0b";
  }

  return (
    <div
      style={{
        marginBottom: "20px",
        color: "#cbd5e1",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          fontWeight: "600",
          color,
        }}
      >
        Password Strength: {strength}
      </div>

      <div style={{ marginBottom: "6px" }}>
        {checks.length ? "✅" : "⭕"} At least 8 characters
      </div>

      <div style={{ marginBottom: "6px" }}>
        {checks.uppercase ? "✅" : "⭕"} One uppercase letter
      </div>

      <div style={{ marginBottom: "6px" }}>
        {checks.lowercase ? "✅" : "⭕"} One lowercase letter
      </div>

      <div style={{ marginBottom: "6px" }}>
        {checks.number ? "✅" : "⭕"} One number
      </div>

      <div>
        {checks.special ? "✅" : "⭕"} One special character
      </div>
    </div>
  );
}
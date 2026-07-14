import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  placeholder = "Password",
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        marginBottom: "16px",
      }}
    >
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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
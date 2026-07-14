export default function Input({
  type = "text",
  name,
  placeholder = "",
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete = "off",
  minLength,
  maxLength,
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      minLength={minLength}
      maxLength={maxLength}
      style={{
        width: "100%",
        padding: "16px",
        background: "#0d1226",
        border: "1px solid #232b45",
        borderRadius: "16px",
        color: "#ffffff",
        fontSize: "16px",
        outline: "none",
        boxSizing: "border-box",
        marginBottom: "16px",
        opacity: disabled ? 0.7 : 1,
      }}
    />
  );
}
export default function Button({
  children,
  onClick,
  type = "button",
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "14px 28px",
        background: "linear-gradient(135deg, #6d5dff, #4b8dff)",
        color: "#ffffff",
        border: "none",
        borderRadius: "16px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.25s",
        boxShadow: "0 10px 30px rgba(109,93,255,.35)",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}
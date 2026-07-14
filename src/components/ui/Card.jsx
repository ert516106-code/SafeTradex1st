export default function Card({ children }) {
  return (
    <div
      style={{
        background: "#0d1226",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,.05)",
        boxShadow: "0 20px 50px rgba(0,0,0,.35)",
      }}
    >
      {children}
    </div>
  );
}
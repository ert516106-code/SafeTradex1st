export default function Spinner() {
  return (
    <div
      style={{
        width: "30px",
        height: "30px",
        border: "4px solid #ccc",
        borderTop: "4px solid blue",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }}
    />
  );
}

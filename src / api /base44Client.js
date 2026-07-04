function CountryPromptModal({ onSaved }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}
      >
        <h2>Select Country</h2>

        <button
          onClick={onSaved}
          style={{
            padding: "10px",
            marginTop: "10px"
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default CountryPromptModal;

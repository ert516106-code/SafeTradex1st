export default function MaintenanceScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top,#18254b 0%,#050816 70%)',
        color: '#fff',
        padding: 20,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>🛠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        SafeTradeX is under maintenance
      </h1>
      <p style={{ color: '#94A3B8', maxWidth: 360 }}>
        We're performing scheduled maintenance. Please check back shortly.
      </p>
    </div>
  );
}

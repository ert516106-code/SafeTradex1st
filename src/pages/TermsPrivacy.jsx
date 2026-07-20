import ProfilePageShell from "../components/profile/ProfilePageShell";

export default function TermsPrivacy() {
  return (
    <ProfilePageShell title="Terms & Privacy" subtitle="Legal information">
      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 18,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Terms of Service</div>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          By using SafeTrade, you agree to our platform rules regarding trading conduct,
          account security, and fee structures. This is placeholder mock content for
          demonstration purposes only.
        </p>
      </div>

      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 18,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</div>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          SafeTrade respects your privacy. Mock policy text describing how account and
          usage data would be collected, stored, and protected in a production environment.
        </p>
      </div>
    </ProfilePageShell>
  );
}

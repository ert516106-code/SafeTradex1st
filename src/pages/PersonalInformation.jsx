import ProfilePageShell from "../components/profile/ProfilePageShell";

const fields = [
  { label: "Full Name", value: "Alex Morgan" },
  { label: "Username", value: "alexmorgan" },
  { label: "Email", value: "alex.morgan@example.com" },
  { label: "Phone Number", value: "+1 (555) 012-3456" },
  { label: "Country", value: "United States" },
  { label: "Date of Birth", value: "March 14, 1994" },
];

export default function PersonalInformation() {
  return (
    <ProfilePageShell title="Personal Information" subtitle="Name, email, phone">
      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          overflow: "hidden",
        }}
      >
        {fields.map((field, idx) => (
          <div
            key={field.label}
            style={{
              padding: "16px 18px",
              borderBottom: idx !== fields.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 4 }}>{field.label}</div>
            <div style={{ fontSize: 14.5, fontWeight: 500 }}>{field.value}</div>
          </div>
        ))}
      </div>
    </ProfilePageShell>
  );
}

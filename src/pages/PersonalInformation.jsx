import { useEffect, useState } from "react";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import { supabase } from "../lib/supabase";

export default function PersonalInformation() {
  const [profile, setProfile] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Please sign in to view your personal information.");
        return;
      }

      setAuthEmail(user.email || "");

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, email, country, uid, account_id")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        return;
      }

      setProfile(data);
    }

    loadProfile();
  }, []);

  const fields = [
    { label: "Full Name", value: profile?.full_name || "Not provided" },
    { label: "Email", value: profile?.email || authEmail || "Not provided" },
    {
      label: "Account ID",
      value:
        profile?.account_id ||
        (profile?.uid ? `STX${profile.uid}` : "Not available"),
    },
    { label: "Country", value: profile?.country || "Not provided" },
  ];

  return (
    <ProfilePageShell title="Personal Information" subtitle="Your account details">
      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          overflow: "hidden",
        }}
      >
        {error ? (
          <div style={{ padding: "16px 18px", color: "#f87171", fontSize: 14 }}>
            {error}
          </div>
        ) : !profile ? (
          <div style={{ padding: "16px 18px", color: "#8FA4D8", fontSize: 14 }}>
            Loading account details…
          </div>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.label}
              style={{
                padding: "16px 18px",
                borderBottom:
                  index !== fields.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
              }}
            >
              <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 4 }}>
                {field.label}
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 500 }}>
                {field.value}
              </div>
            </div>
          ))
        )}
      </div>
    </ProfilePageShell>
  );
}

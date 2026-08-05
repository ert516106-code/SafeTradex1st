import { useState, useEffect } from "react";
import { ShieldCheck, KeyRound, Smartphone, Mail, ChevronRight, X } from "lucide-react";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import { supabase } from "../lib/supabase";

const STATUS_LABELS = {
  not_linked: "Not linked",
  pending: "Pending",
  approved: "Approved",
};

const STATUS_COLORS = {
  not_linked: { bg: "rgba(148,163,184,0.14)", fg: "#94a3b8" },
  pending: { bg: "rgba(245,158,11,0.14)", fg: "#f59e0b" },
  approved: { bg: "rgba(16,185,129,0.14)", fg: "#34d399" },
};

function StatusPill({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.not_linked;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
      }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function VerificationModal({ open, kind, currentValue, onClose, onSubmitted }) {
  const [value, setValue] = useState(currentValue || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(currentValue || "");
    setError("");
  }, [open, currentValue]);

  if (!open) return null;

  const isPhone = kind === "phone";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) {
      setError(`Enter your ${isPhone ? "phone number" : "email address"}.`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const { error: rpcError } = await supabase.rpc("submit_verification_request", {
        kind,
        value: value.trim(),
      });
      if (rpcError) throw rpcError;
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#0c1226",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
            {isPhone ? "Phone Verification" : "Email Verification"}
          </h3>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={16} color="#94a3b8" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            {isPhone ? "Phone number" : "Email address"}
          </label>
          <input
            type={isPhone ? "tel" : "email"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isPhone ? "+1 555 123 4567" : "you@example.com"}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "12px 14px",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 8,
            }}
          />
          {error && <p style={{ color: "#f87171", fontSize: 12.5, marginBottom: 8 }}>{error}</p>}
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 18 }}>
            Your submission will be reviewed by an admin. Status will show as "Pending" until approved.
          </p>
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 16,
              border: "none",
              background: saving ? "rgba(124,58,237,0.4)" : "linear-gradient(90deg, #7C3AED, #2563EB)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14.5,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Submitting..." : "Submit for review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SecurityCenter() {
  const [profile, setProfile] = useState(null);
  const [modalKind, setModalKind] = useState(null);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("phone_number, phone_verification_status, verification_email, email_verification_status")
      .eq("id", user.id)
      .single();
    setProfile(data);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const phoneStatus = profile?.phone_verification_status || "not_linked";
  const emailStatus = profile?.email_verification_status || "not_linked";

  const staticItems = [
    { icon: KeyRound, label: "Change Password", desc: "Last changed 3 months ago" },
    { icon: Smartphone, label: "Two-Factor Authentication", desc: "Enabled via Authenticator App" },
  ];

  return (
    <ProfilePageShell title="Security Center" subtitle="2FA, password, devices">
      {staticItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.03)",
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "rgba(16,185,129,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} color="#34d399" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
            <ChevronRight size={16} color="#475569" />
          </div>
        );
      })}

      <button
        onClick={() => phoneStatus === "not_linked" && setModalKind("phone")}
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          cursor: phoneStatus === "not_linked" ? "pointer" : "default",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "rgba(16,185,129,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Smartphone size={18} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Phone Verification</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              {profile?.phone_number || "Add a phone number for verification"}
            </div>
          </div>
        </div>
        <StatusPill status={phoneStatus} />
      </button>

      <button
        onClick={() => emailStatus === "not_linked" && setModalKind("email")}
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          cursor: emailStatus === "not_linked" ? "pointer" : "default",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "rgba(16,185,129,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mail size={18} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Email Verification</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              {profile?.verification_email || "Add an email for verification"}
            </div>
          </div>
        </div>
        <StatusPill status={emailStatus} />
      </button>

      <VerificationModal
        open={modalKind !== null}
        kind={modalKind}
        currentValue={modalKind === "phone" ? profile?.phone_number : profile?.verification_email}
        onClose={() => setModalKind(null)}
        onSubmitted={loadProfile}
      />
    </ProfilePageShell>
  );
}

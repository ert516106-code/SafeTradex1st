import { useEffect, useState } from "react";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import { supabase } from "../lib/supabase";
import { submitKyc, getMyKycStatus } from "../services/kycService";
import { Camera, ChevronLeft } from "lucide-react";

const DOCUMENT_TYPES = ["Passport", "Driver's License", "National ID"];

function UploadBox({ label, file, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: 16,
          border: "1px dashed rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.03)",
          padding: "24px 16px",
          cursor: "pointer",
        }}
      >
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt={label}
            style={{ maxHeight: 120, borderRadius: 10 }}
          />
        ) : (
          <>
            <Camera size={22} color="#8FA4D8" />
            <span style={{ fontSize: 13, color: "#8FA4D8" }}>Tap to upload photo</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
}

export default function KycVerification() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [documentType, setDocumentType] = useState("Passport");
  const [idNumber, setIdNumber] = useState("");
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);
  const [handheldFile, setHandheldFile] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);
      const status = await getMyKycStatus(user.id);
      setExisting(status);
      setLoading(false);
    }
    init();
  }, []);

  async function handleSubmit() {
    setError("");
    if (!fullName || !idFrontFile || !idBackFile || !handheldFile) {
      setError("Please complete all steps before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await submitKyc({
        userId,
        fullName,
        documentType,
        idNumber,
        idFrontFile,
        idBackFile,
        handheldFile,
      });
      const status = await getMyKycStatus(userId);
      setExisting(status);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 16,
  };

  const buttonStyle = (disabled) => ({
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    border: "none",
    background: disabled ? "#334155" : "#3b82f6",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  if (loading) {
    return (
      <ProfilePageShell title="KYC Verification" subtitle="Identity verification">
        <p style={{ color: "#8FA4D8" }}>Loading...</p>
      </ProfilePageShell>
    );
  }

  if (existing) {
    const statusLabel = { pending: "Pending Review", approved: "Approved", denied: "Denied" }[existing.status] || existing.status;
    const statusColor = { pending: "#f59e0b", approved: "#22c55e", denied: "#ef4444" }[existing.status] || "#94a3b8";

    return (
      <ProfilePageShell title="KYC Verification" subtitle="Identity verification">
        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.03)",
            padding: 20,
          }}
        >
          <div style={{ fontSize: 13, color: "#8FA4D8", marginBottom: 8 }}>Status</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: statusColor, marginBottom: 16 }}>
            {statusLabel}
          </div>
          {existing.status === "denied" && (
            <p style={{ fontSize: 13, color: "#8FA4D8", marginBottom: 16 }}>
              Your submission was denied. Please contact support or submit again with valid documents.
            </p>
          )}
          {existing.status === "pending" && (
            <p style={{ fontSize: 13, color: "#8FA4D8" }}>
              Your documents are under review. This usually takes 1–2 business days.
            </p>
          )}
          {existing.status === "denied" && (
            <button
              onClick={() => setExisting(null)}
              style={buttonStyle(false)}
            >
              Submit again
            </button>
          )}
        </div>
      </ProfilePageShell>
    );
  }

  return (
    <ProfilePageShell title="KYC Verification" subtitle={`Step ${step} of 3`}>
      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 20,
        }}
      >
        {error && (
          <div style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}

        {step === 1 && (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Personal Information</div>
            <p style={{ fontSize: 13, color: "#8FA4D8", marginBottom: 18 }}>Enter your details exactly as on your ID.</p>

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Full Name</div>
            <input
              type="text"
              placeholder="As shown on ID"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
            />

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Document Type</div>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={inputStyle}
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>ID / Passport Number</div>
            <input
              type="text"
              placeholder="ID / Passport number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={() => setStep(2)}
              disabled={!fullName}
              style={buttonStyle(!fullName)}
            >
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Upload Documents</div>
            <p style={{ fontSize: 13, color: "#8FA4D8", marginBottom: 18 }}>Upload clear photos of your ID front and back.</p>

            <UploadBox label="ID Front" file={idFrontFile} onChange={setIdFrontFile} />
            <UploadBox label="ID Back" file={idBackFile} onChange={setIdBackFile} />

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep(1)}
                style={{ ...buttonStyle(false), background: "rgba(255,255,255,0.08)", flex: 1 }}
              >
                <ChevronLeft size={16} style={{ verticalAlign: "middle" }} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!idFrontFile || !idBackFile}
                style={{ ...buttonStyle(!idFrontFile || !idBackFile), flex: 1 }}
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Handheld Photo</div>
            <p style={{ fontSize: 13, color: "#8FA4D8", marginBottom: 18 }}>
              Take a photo of yourself holding your ID next to your face.
            </p>

            <UploadBox label="Handheld ID Photo" file={handheldFile} onChange={setHandheldFile} />

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep(2)}
                style={{ ...buttonStyle(false), background: "rgba(255,255,255,0.08)", flex: 1 }}
              >
                <ChevronLeft size={16} style={{ verticalAlign: "middle" }} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!handheldFile || submitting}
                style={{ ...buttonStyle(!handheldFile || submitting), flex: 1 }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </ProfilePageShell>
  );
}

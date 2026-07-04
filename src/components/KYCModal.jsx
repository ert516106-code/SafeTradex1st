import { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function KYCModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: '', id_type: 'passport', id_number: '' });
  const [files, setFiles] = useState({ front: null, back: null, selfie: null });
  const [previews, setPreviews] = useState({ front: null, back: null, selfie: null });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    base44.auth.me().then(u =>
      base44.entities.KYCVerification.filter({ user_email: u.email })
    ).then(recs => {
      if (recs.length) setExisting(recs[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [open]);

  const handleFile = (field, file) => {
    if (!file) return;
    setFiles(f => ({ ...f, [field]: file }));
    setPreviews(p => ({ ...p, [field]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.id_number) { toast.error('Please fill all fields'); return; }
    if (!files.front || !files.back || !files.selfie) { toast.error('Please upload all documents'); return; }
    setSubmitting(true);
    try {
      const user = await base44.auth.me();
      const [frontRes, backRes, selfieRes] = await Promise.all([
        base44.integrations.Core.UploadFile({ file: files.front }),
        base44.integrations.Core.UploadFile({ file: files.back }),
        base44.integrations.Core.UploadFile({ file: files.selfie }),
      ]);
      await base44.entities.KYCVerification.create({
        user_email: user.email,
        full_name: form.full_name,
        id_type: form.id_type,
        id_number: form.id_number,
        id_front_url: frontRes.file_url,
        id_back_url: backRes.file_url,
        selfie_url: selfieRes.file_url,
        status: 'pending',
      });
      toast.success('KYC submitted! Under review.');
      const recs = await base44.entities.KYCVerification.filter({ user_email: user.email });
      setExisting(recs[0]);
    } catch {
      toast.error('Submission failed. Try again.');
    }
    setSubmitting(false);
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 512, backgroundColor: '#fff', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#d1d5db' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 12px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>KYC Verification</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 20, height: 20, color: '#9ca3af' }} /></button>
        </div>

        <div style={{ overflowY: 'auto', padding: '20px 20px 40px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>Loading...</div>
          ) : existing ? (
            <StatusView kyc={existing} />
          ) : (
            <>
              {/* Steps indicator */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {[1,2,3].map(s => (
                  <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: step >= s ? '#3b82f6' : '#e5e7eb' }} />
                ))}
              </div>

              {step === 1 && (
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Personal Information</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Enter your details exactly as on your ID.</p>
                  <Label>Full Name</Label>
                  <Input placeholder="As shown on ID" value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} />
                  <Label>Document Type</Label>
                  <select value={form.id_type} onChange={e => setForm(f => ({ ...f, id_type: e.target.value }))}
                    style={{ width: '100%', height: 48, border: '1px solid #e5e7eb', borderRadius: 12, padding: '0 16px', fontSize: 14, outline: 'none', marginBottom: 16, backgroundColor: '#fff' }}>
                    <option value="passport">Passport</option>
                    <option value="driver_license">Driver's License</option>
                  </select>
                  <Label>Document Number</Label>
                  <Input placeholder="ID / Passport number" value={form.id_number} onChange={v => setForm(f => ({ ...f, id_number: v }))} />
                  <NavBtn onClick={() => { if (!form.full_name || !form.id_number) { toast.error('Fill all fields'); return; } setStep(2); }} label="Continue →" />
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Upload Documents</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Upload clear photos of your ID front and back.</p>
                  <FileUpload label="ID Front" field="front" preview={previews.front} onChange={f => handleFile('front', f)} />
                  <FileUpload label="ID Back" field="back" preview={previews.back} onChange={f => handleFile('back', f)} />
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <NavBtn onClick={() => setStep(1)} label="← Back" secondary />
                    <NavBtn onClick={() => { if (!files.front || !files.back) { toast.error('Upload both sides'); return; } setStep(3); }} label="Continue →" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Selfie Verification</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Take a selfie holding your ID clearly visible.</p>
                  <FileUpload label="Selfie with ID" field="selfie" preview={previews.selfie} onChange={f => handleFile('selfie', f)} />
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <NavBtn onClick={() => setStep(2)} label="← Back" secondary />
                    <NavBtn onClick={handleSubmit} label={submitting ? 'Submitting...' : 'Submit KYC'} disabled={submitting} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusView({ kyc }) {
  const config = {
    pending:  { icon: <Clock style={{ width: 40, height: 40, color: '#f59e0b' }} />, bg: '#fffbeb', color: '#92400e', label: 'Under Review', msg: 'Your documents are being verified. This usually takes 1–3 business days.' },
    approved: { icon: <CheckCircle style={{ width: 40, height: 40, color: '#10b981' }} />, bg: '#d1fae5', color: '#065f46', label: 'Approved ✅', msg: 'Your identity has been verified successfully.' },
    rejected: { icon: <XCircle style={{ width: 40, height: 40, color: '#ef4444' }} />, bg: '#fee2e2', color: '#7f1d1d', label: 'Rejected', msg: kyc.rejection_reason || 'Your submission was rejected. Please resubmit with clearer documents.' },
  }[kyc.status] || {};

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        {config.icon}
      </div>
      <h3 style={{ fontWeight: 800, fontSize: 20, color: config.color, marginBottom: 8 }}>{config.label}</h3>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>{config.msg}</p>
      <div style={{ backgroundColor: '#f9fafb', borderRadius: 14, padding: 16, textAlign: 'left', fontSize: 13 }}>
        <Row label="Full Name" value={kyc.full_name} />
        <Row label="ID Type" value={kyc.id_type?.replace('_', ' ').toUpperCase()} />
        <Row label="ID Number" value={kyc.id_number} />
        <Row label="Submitted" value={new Date(kyc.created_date).toLocaleDateString()} />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Label({ children }) {
  return <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#374151' }}>{children}</p>;
}

function Input({ placeholder, value, onChange }) {
  return (
    <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', height: 48, border: '1px solid #e5e7eb', borderRadius: 12, padding: '0 16px', fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />
  );
}

function NavBtn({ onClick, label, secondary, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ flex: 1, height: 52, borderRadius: 14, backgroundColor: secondary ? '#f3f4f6' : '#3b82f6', color: secondary ? '#374151' : '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', opacity: disabled ? 0.6 : 1 }}>
      {label}
    </button>
  );
}

function FileUpload({ label, preview, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#374151' }}>{label}</p>
      <label style={{ display: 'block', cursor: 'pointer' }}>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => onChange(e.target.files[0])} />
        <div style={{ border: '2px dashed #d1d5db', borderRadius: 14, padding: 20, textAlign: 'center', backgroundColor: preview ? '#f0fdf4' : '#f9fafb' }}>
          {preview ? (
            <img src={preview} alt="preview" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }} />
          ) : (
            <div>
              <Upload style={{ width: 28, height: 28, color: '#9ca3af', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 13, color: '#6b7280' }}>Tap to upload photo</p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

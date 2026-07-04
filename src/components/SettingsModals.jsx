import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Bell, Shield, Link, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/LanguageContext';

function ModalShell({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 512, backgroundColor: '#fff', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#d1d5db' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 12px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 20, height: 20, color: '#9ca3af' }} /></button>
        </div>
        <div style={{ overflowY: 'auto', padding: '20px 20px 40px' }}>{children}</div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#374151' }}>{label}</p>
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', height: 48, border: '1px solid #e5e7eb', borderRadius: 12, padding: '0 44px 0 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        <button onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
        </button>
      </div>
    </div>
  );
}

function SubmitBtn({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: '100%', height: 52, borderRadius: 14, backgroundColor: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', marginTop: 8, opacity: disabled ? 0.6 : 1 }}>
      {label}
    </button>
  );
}

// ─── Fund Password ─────────────────────────────────────────────
export function FundPasswordModal({ open, onClose }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  if (!open) return null;
  const handle = () => {
    if (next.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (next !== confirm) { toast.error('Passwords do not match'); return; }
    toast.success('Fund password updated successfully');
    setCurrent(''); setNext(''); setConfirm('');
    onClose();
  };
  return (
    <ModalShell title="Set Fund Password" onClose={onClose}>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Fund password is required to authorize withdrawals and transfers.</p>
      <PasswordInput label="Current Password (if set)" value={current} onChange={setCurrent} />
      <PasswordInput label="New Fund Password" value={next} onChange={setNext} />
      <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} />
      <SubmitBtn label="Update Fund Password" onClick={handle} />
    </ModalShell>
  );
}

// ─── Login Password ────────────────────────────────────────────
export function LoginPasswordModal({ open, onClose }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  if (!open) return null;
  const handle = () => {
    if (next.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (next !== confirm) { toast.error('Passwords do not match'); return; }
    toast.success('Login password updated');
    setCurrent(''); setNext(''); setConfirm('');
    onClose();
  };
  return (
    <ModalShell title="Change Login Password" onClose={onClose}>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Use a strong password with letters, numbers, and symbols.</p>
      <PasswordInput label="Current Password" value={current} onChange={setCurrent} />
      <PasswordInput label="New Password (min 8 chars)" value={next} onChange={setNext} />
      <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} />
      <SubmitBtn label="Update Login Password" onClick={handle} />
    </ModalShell>
  );
}

// ─── Language ──────────────────────────────────────────────────
const languages = ['English', 'Chinese (简体)', 'Chinese (繁體)', 'Japanese', 'Korean', 'Spanish', 'French', 'German', 'Arabic', 'Russian', 'Portuguese', 'Vietnamese', 'Thai'];
export function LanguageModal({ open, onClose }) {
  const { language, setLanguage } = useLanguage();
  if (!open) return null;
  return (
    <ModalShell title="Select Language" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {languages.map(lang => (
          <button key={lang} onClick={() => { setLanguage(lang); toast.success(`Language set to ${lang}`); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: 'none', backgroundColor: language === lang ? '#eff6ff' : '#f9fafb', cursor: 'pointer' }}>
            <span style={{ fontWeight: language === lang ? 600 : 400, color: language === lang ? '#3b82f6' : '#374151' }}>{lang}</span>
            {language === lang && <span style={{ color: '#3b82f6', fontSize: 18 }}>✓</span>}
          </button>
        ))}
      </div>
    </ModalShell>
  );
}

// ─── Notifications ─────────────────────────────────────────────
export function NotificationsModal({ open, onClose }) {
  const [settings, setSettings] = useState({
    trade_results: true, price_alerts: true, deposits: true,
    withdrawals: true, promotions: false, security_alerts: true,
  });
  if (!open) return null;
  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));
  const items = [
    { key: 'trade_results', label: 'Trade Results', desc: 'Win/loss notifications after each trade' },
    { key: 'price_alerts', label: 'Price Alerts', desc: 'Alerts when assets hit target prices' },
    { key: 'deposits', label: 'Deposit Confirmations', desc: 'Notify when funds arrive' },
    { key: 'withdrawals', label: 'Withdrawal Updates', desc: 'Status updates on withdrawals' },
    { key: 'security_alerts', label: 'Security Alerts', desc: 'Login attempts and account changes' },
    { key: 'promotions', label: 'Promotions & Offers', desc: 'Bonus and promotional campaigns' },
  ];
  return (
    <ModalShell title="Notification Settings" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{item.desc}</p>
            </div>
            <button onClick={() => toggle(item.key)}
              style={{ width: 44, height: 24, borderRadius: 999, backgroundColor: settings[item.key] ? '#3b82f6' : '#d1d5db', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: settings[item.key] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s' }} />
            </button>
          </div>
        ))}
      </div>
      <SubmitBtn label="Save Preferences" onClick={() => { toast.success('Notification preferences saved'); onClose(); }} />
    </ModalShell>
  );
}

// ─── Security Center ───────────────────────────────────────────
export function SecurityModal({ open, onClose }) {
  if (!open) return null;
  const items = [
    { icon: '🔐', label: 'Two-Factor Authentication (2FA)', desc: 'Add an extra layer of security', badge: 'Recommended', badgeColor: '#10b981' },
    { icon: '🛡️', label: 'Anti-Phishing Code', desc: 'Unique code in all official emails', badge: 'Not Set', badgeColor: '#f59e0b' },
    { icon: '📱', label: 'Phone Verification', desc: 'Verify withdrawals via SMS', badge: 'Not Linked', badgeColor: '#6b7280' },
    { icon: '📧', label: 'Email Verification', desc: 'Confirm sensitive actions via email', badge: 'Active', badgeColor: '#3b82f6' },
    { icon: '🔒', label: 'Login Device Management', desc: 'View and remove authorized devices', badge: null, badgeColor: null },
  ];
  return (
    <ModalShell title="Security Center" onClose={onClose}>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Strengthen your account security with these settings.</p>
      {items.map(item => (
        <button key={item.label} onClick={() => toast.info(`${item.label} — coming soon`)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f3f4f6', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontSize: 22, width: 32, flexShrink: 0 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{item.label}</p>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{item.desc}</p>
          </div>
          {item.badge && (
            <span style={{ fontSize: 11, fontWeight: 600, color: item.badgeColor, backgroundColor: item.badgeColor + '20', padding: '3px 10px', borderRadius: 999, flexShrink: 0 }}>{item.badge}</span>
          )}
          <span style={{ color: '#d1d5db', fontSize: 16, flexShrink: 0 }}>›</span>
        </button>
      ))}
    </ModalShell>
  );
}

// ─── Account Binding ───────────────────────────────────────────
const BINDING_ITEMS = [
  { icon: '📧', label: 'Email Address', desc: 'Used for login & verification', type: null },
  { icon: '📱', label: 'Phone Number', desc: 'SMS verification for withdrawals', type: 'phone', placeholder: 'Enter phone number' },
  { icon: 'G',  label: 'Google Account', desc: 'Login with Google', type: 'google', placeholder: 'Enter Google email' },
  { icon: '🔑', label: 'Hardware Key (WebAuthn)', desc: 'Physical security key', type: 'hardware_key', placeholder: 'Enter key identifier' },
];

export function AccountBindingModal({ open, onClose }) {
  const [bindings, setBindings] = useState([]);
  const [bindingFor, setBindingFor] = useState(null); // item type
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!open) return;
    base44.auth.me().then(u => {
      setUserEmail(u.email);
      return base44.entities.AccountBinding.filter({ user_email: u.email });
    }).then(recs => setBindings(recs)).catch(() => {});
  }, [open]);

  const getStatus = (type) => {
    if (!type) return 'linked'; // email always linked
    const rec = bindings.find(b => b.binding_type === type);
    return rec?.status || null;
  };

  const handleBind = async () => {
    if (!value.trim()) { toast.error('Please enter a value'); return; }
    setSubmitting(true);
    await base44.entities.AccountBinding.create({ user_email: userEmail, binding_type: bindingFor, binding_value: value.trim(), status: 'pending' });
    toast.success('Binding request submitted! Awaiting admin approval.');
    const recs = await base44.entities.AccountBinding.filter({ user_email: userEmail });
    setBindings(recs);
    setBindingFor(null);
    setValue('');
    setSubmitting(false);
  };

  if (!open) return null;

  return (
    <ModalShell title="Account Binding" onClose={onClose}>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Link accounts and methods to improve security and recovery options.</p>
      {BINDING_ITEMS.map(item => {
        const status = getStatus(item.type);
        return (
          <div key={item.label} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{item.desc}</p>
              </div>
              {!item.type ? (
                <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, backgroundColor: '#d1fae5', color: '#065f46' }}>Linked ✓</span>
              ) : status === 'approved' ? (
                <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, backgroundColor: '#d1fae5', color: '#065f46' }}>Linked ✓</span>
              ) : status === 'pending' ? (
                <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, backgroundColor: '#fef3c7', color: '#92400e' }}>Pending</span>
              ) : status === 'rejected' ? (
                <button onClick={() => { setBindingFor(item.type); setValue(''); }}
                  style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                  Retry
                </button>
              ) : (
                <button onClick={() => { setBindingFor(item.type); setValue(''); }}
                  style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                  Bind
                </button>
              )}
            </div>
            {bindingFor === item.type && (
              <div style={{ paddingBottom: 14 }}>
                <input
                  placeholder={item.placeholder}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  style={{ width: '100%', height: 44, border: '1px solid #e5e7eb', borderRadius: 12, padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setBindingFor(null)} style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: '#f3f4f6', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleBind} disabled={submitting} style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </ModalShell>
  );
}

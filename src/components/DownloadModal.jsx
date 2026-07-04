import { X, Share, MoreVertical, Plus, Chrome } from 'lucide-react';

export default function DownloadModal({ open, onClose }) {
  if (!open) return null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 512, backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '20px 24px 40px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#d1d5db' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>Ax</span>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Ascendex</p>
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Install on your device</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X style={{ width: 20, height: 20, color: '#9ca3af' }} />
          </button>
        </div>

        {/* iOS Instructions */}
        {isIOS && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Install on iPhone / iPad</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Step num={1} icon={<Share style={{ width: 18, height: 18, color: '#3b82f6' }} />}
                text='Tap the Share button at the bottom of your browser' />
              <Step num={2} icon={<Plus style={{ width: 18, height: 18, color: '#3b82f6' }} />}
                text='Scroll down and tap "Add to Home Screen"' />
              <Step num={3} icon={<span style={{ fontSize: 18 }}>✅</span>}
                text='Tap "Add" — the app icon will appear on your home screen' />
            </div>
          </div>
        )}

        {/* Android Instructions */}
        {isAndroid && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Install on Android</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Step num={1} icon={<MoreVertical style={{ width: 18, height: 18, color: '#3b82f6' }} />}
                text='Tap the 3-dot menu (⋮) in the top-right of Chrome' />
              <Step num={2} icon={<Plus style={{ width: 18, height: 18, color: '#3b82f6' }} />}
                text='Tap "Add to Home screen" or "Install app"' />
              <Step num={3} icon={<span style={{ fontSize: 18 }}>✅</span>}
                text='Tap "Add" — the app icon will appear on your home screen' />
            </div>
          </div>
        )}

        {/* Desktop fallback */}
        {!isIOS && !isAndroid && (
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Install on your browser</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Step num={1} icon={<Chrome style={{ width: 18, height: 18, color: '#3b82f6' }} />}
                text='Click the install icon (⬇) in the address bar, or go to browser menu' />
              <Step num={2} icon={<Plus style={{ width: 18, height: 18, color: '#3b82f6' }} />}
                text='Click "Install Ascendex" or "Add to Home Screen"' />
              <Step num={3} icon={<span style={{ fontSize: 18 }}>✅</span>}
                text='The app will open as a standalone window — no browser needed' />
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 14, border: '1px solid #bbf7d0' }}>
          <p style={{ fontSize: 13, color: '#166534', margin: 0, fontWeight: 500 }}>
            ✅ After installing, Ascendex works like a native app — fast, fullscreen, and offline-ready.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({ num, icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingTop: 6 }}>
        <span style={{ fontWeight: 700, color: '#6b7280', fontSize: 12 }}>{num}.</span>
        <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{text}</span>
      </div>
    </div>
  );
}

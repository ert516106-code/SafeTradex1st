import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SUPPORT_URL = 'https://omni-chubby-assist-flow.base44.app';

export default function FloatingSupport() {
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [uidInput, setUidInput] = useState('');
  const [error, setError] = useState('');
  const [myUid, setMyUid] = useState(null);

  const handleOpen = async () => {
    setOpen(true);
    setVerified(false);
    setUidInput('');
    setError('');
    const user = await base44.auth.me().catch(() => null);
    setMyUid(user?.uid != null ? String(user.uid) : null);
  };

  const handleStart = () => {
    if (!uidInput.trim()) { setError('Please enter your UID'); return; }
    if (!myUid || uidInput.trim() !== myUid) { setError('Incorrect UID. Please check and try again.'); return; }
    setError('');
    setVerified(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {!verified ? (
            <div className="flex-1 flex flex-col">
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-5 pb-10 text-white overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    <span className="font-semibold text-sm">Online Chat</span>
                  </div>
                  <button onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <MessageCircle className="w-20 h-20 text-white/20 absolute right-3 top-6" />
              </div>
              <div className="flex-1 px-6 pt-8">
                <p className="text-center font-bold text-lg mb-6">Welcome to Online Support!</p>
                <label className="text-sm font-medium mb-1 block">
                  Your UID <span className="text-red-500">*</span>
                </label>
                <input
                  value={uidInput}
                  onChange={(e) => setUidInput(e.target.value)}
                  placeholder="Enter your account UID"
                  className="w-full h-11 border border-border rounded-lg px-3 text-sm outline-none focus:ring-1 focus:ring-primary mb-2"
                />
                {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
                <button
                  onClick={handleStart}
                  className="w-full h-11 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm mt-4"
                >
                  Start Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Online Service</p>
                    <p className="text-xs text-emerald-500 font-medium">● Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <iframe src={SUPPORT_URL} className="flex-1 w-full border-0" title="Customer Support" />
            </>
          )}
        </div>
      )}
    </>
  );
}

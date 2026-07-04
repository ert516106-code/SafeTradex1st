import { useState, useEffect } from 'react';
import { X, ChevronRight, Copy, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import TermsModal from './TermsModal';
import KYCModal from './KYCModal';
import { FundPasswordModal, LoginPasswordModal, LanguageModal, NotificationsModal, SecurityModal, AccountBindingModal } from './SettingsModals';

const settingsItems = [
{ label: 'KYC Verification', key: 'kyc' },
{ label: 'Set Fund Password', key: 'fund_password' },
{ label: 'Set Login Password', key: 'login_password' },
{ label: 'Language', key: 'language' },
{ label: 'Notification Settings', key: 'notifications' },
{ label: 'Security Center', key: 'security' },
{ label: 'Account Binding', key: 'account_binding' },
{ label: 'Service Terms', key: 'terms' },
{ label: 'Online Service', key: 'online_service' }];


export default function ProfileDrawer({ open, onClose }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!open) return;
    base44.auth.me().then((u) => {
      setUser(u);
      setIsLoggedIn(true);
    }).catch(() => {
      setIsLoggedIn(false);
    });
  }, [open]);

  const uid = user ? (user.uid ?? String(user.id).slice(-7).toUpperCase()) : null;

  const handleCopy = () => {
    if (user?.full_name) {
      navigator.clipboard.writeText(user.full_name);
      toast.success('Username copied');
    }
  };

  const handleLogout = () => {base44.auth.logout();};
  const handleLogin = () => {base44.auth.redirectToLogin();};
  const closeModal = () => setModal(null);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative ml-auto w-full max-w-sm bg-white h-full flex flex-col overflow-hidden">
          {/* Header — fixed */}
          <div className="p-4 flex items-center flex-shrink-0">
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            {isLoggedIn && user ?
            <>
                <div className="px-5 pb-5 flex items-center gap-4 border-b border-border">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground">👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base">Username: {user.full_name}</p>
                    <p className="text-sm text-muted-foreground">UID: {uid}</p>
                    <p className="text-sm text-muted-foreground">Credit score: 100</p>
                    <span className="inline-block mt-1 bg-orange-400 text-white text-xs font-bold px-3 py-0.5 rounded-full">VIP 0</span>
                  </div>
                  <button onClick={handleCopy} className="text-xs border border-border py-2 font-medium rounded-lg opacity-100 px-4">
                    Copy Username
                  </button>
                </div>

                <div className="px-5 pt-5">
                  <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-3">SETTINGS</p>
                  <div className="space-y-1">
                    {settingsItems.map((item) =>
                  <button key={item.key} onClick={() => {if (item.key === 'online_service') {window.open('https://omni-chubby-assist-flow.base44.app', '_blank');} else {setModal(item.key);}}}
                  className="w-full flex items-center justify-between py-3 border-b border-border/50 text-sm">
                        <span>{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                  )}
                  </div>
                </div>

                <div className="px-5 pb-16 pt-8">
                  <button onClick={handleLogout}
                className="w-full h-16 rounded-2xl bg-red-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-500/40 active:scale-95 transition-transform">
                    <LogOut className="w-6 h-6" /> Log out
                  </button>
                </div>
              </> :

            <LoginPanel onLogin={handleLogin} />
            }
          </div>
        </div>
      </div>

      {/* Modals */}
      <KYCModal open={modal === 'kyc'} onClose={closeModal} />
      <FundPasswordModal open={modal === 'fund_password'} onClose={closeModal} />
      <LoginPasswordModal open={modal === 'login_password'} onClose={closeModal} />
      <LanguageModal open={modal === 'language'} onClose={closeModal} />
      <NotificationsModal open={modal === 'notifications'} onClose={closeModal} />
      <SecurityModal open={modal === 'security'} onClose={closeModal} />
      <AccountBindingModal open={modal === 'account_binding'} onClose={closeModal} />
      <TermsModal open={modal === 'terms'} onClose={closeModal} />
    </>);

}

function LoginPanel({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="px-5 pt-2 flex-1">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl">🇬🇧</span>
      </div>
      <h2 className="text-2xl font-bold mb-6">Welcome to login</h2>

      <div className="border rounded-2xl p-5">
        <p className="text-lg font-bold mb-1">Login</p>
        <div className="flex gap-4 border-b border-border mb-5">
          <button onClick={() => setTab('login')}
          className={`pb-2 text-sm font-medium ${tab === 'login' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>
            Account login
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account</p>
            <input value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full h-11 border border-border rounded-lg px-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Password</p>
            <div className="relative">
              <input value={password} onChange={(e) => setPassword(e.target.value)}
              type={showPass ? 'text' : 'password'}
              placeholder="Please enter"
              className="w-full h-11 border border-border rounded-lg px-3 text-sm outline-none focus:ring-1 focus:ring-primary pr-10" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
            Remember password
          </label>
        </div>

        <button onClick={onLogin}
        className="w-full h-12 rounded-full bg-primary text-white font-bold text-base mt-5">
          Login
        </button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          No account yet?{' '}
          <button onClick={onLogin} className="text-primary font-semibold">Register Now</button>
        </p>
      </div>
    </div>);

}

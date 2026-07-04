import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, CandlestickChart, PiggyBank, Wallet } from 'lucide-react';

const tabs = [
{ path: '/', icon: Home, label: 'Home' },
{ path: '/markets', icon: LineChart, label: 'Markets' },
{ path: '/trade', icon: CandlestickChart, label: 'Trade' },
{ path: '/financial', icon: PiggyBank, label: 'Financial' },
{ path: '/assets', icon: Wallet, label: 'Assets' }];


// Only show the floating nav on these pages — everywhere else relies on the page's own back button
const VISIBLE_PAGES = ['/', '/assets'];

export default function BottomNav() {
  const location = useLocation();

  if (!VISIBLE_PAGES.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 font-inter w-[calc(100%-2rem)] max-w-md">
      <div className="flex justify-around items-center bg-white/95 backdrop-blur-md border border-border rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.12)] px-2 py-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-0.5 flex-1">
              <div className={`p-2 rounded-2xl transition-all duration-200 ${active ? 'bg-primary/10 scale-110' : 'scale-100'}`}>
                <Icon className={`w-5 h-5 transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={active ? 2.4 : 2} />
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </Link>);

        })}
      </div>
    </nav>);

}

import { useState, useEffect } from 'react';
import { X, ArrowLeftRight, ChevronDown, Check, Delete } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const COINS = [
  { symbol: 'USDT', name: 'Tether',   color: 'bg-emerald-500', text: '₮' },
  { symbol: 'USDC', name: 'USD Coin', color: 'bg-blue-500',    text: '$' },
  { symbol: 'BTC',  name: 'Bitcoin',  color: 'bg-orange-500',  text: '₿' },
  { symbol: 'ETH',  name: 'Ethereum', color: 'bg-indigo-500',  text: 'Ξ' },
  { symbol: 'SOL',  name: 'Solana',   color: 'bg-purple-500',  text: '◎' },
  { symbol: 'BNB',  name: 'BNB',      color: 'bg-yellow-500',  text: 'B' },
];

const RATES = { USDT: 1, USDC: 1, BTC: 68400, ETH: 3850, SOL: 185, BNB: 590 };

const NUMPAD = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  ['.','0','⌫'],
];

export default function ConvertModal({ open, onClose }) {
  const [from, setFrom]     = useState(COINS[0]);
  const [to, setTo]         = useState(COINS[2]);
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState(0);
  const [balRec, setBalRec]   = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker]     = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSuccess(false);
    setAmount('0');
    setShowFromPicker(false);
    setShowToPicker(false);
    base44.auth.me().then(u => {
      setUserEmail(u.email);
      return base44.entities.UserBalance.filter({ user_email: u.email });
    }).then(recs => {
      if (recs.length) { setBalance(recs[0].balance ?? 0); setBalRec(recs[0]); }
    }).catch(() => {});
  }, [open]);

  const fromRate = RATES[from.symbol] ?? 1;
  const toRate   = RATES[to.symbol]   ?? 1;
  const numAmt   = parseFloat(amount) || 0;
  const converted = numAmt > 0 ? +(numAmt * fromRate / toRate).toFixed(8) : 0;
  const fromBalance = (from.symbol === 'USDT' || from.symbol === 'USDC') ? balance : 0;

  const handleNumpad = (key) => {
    if (key === '⌫') {
      setAmount(prev => prev.length <= 1 ? '0' : prev.slice(0, -1));
    } else if (key === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + '.');
    } else {
      setAmount(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleSwap = () => { setFrom(to); setTo(from); setAmount('0'); };
  const handleMax  = () => setAmount(String(fromBalance));

  const handleConvert = async () => {
    if (!numAmt || numAmt <= 0) { toast.error('Enter an amount'); return; }
    const usdtCost = +(numAmt * fromRate).toFixed(2);
    if ((from.symbol === 'USDT' || from.symbol === 'USDC') && usdtCost > balance) {
      toast.error('Insufficient balance'); return;
    }
    if (from.symbol !== 'USDT' && from.symbol !== 'USDC') {
      toast.error(`You have 0 ${from.symbol} available`); return;
    }
    setLoading(true);
    const newBal = +(balance - usdtCost).toFixed(2);
    await base44.entities.UserBalance.update(balRec.id, { balance: newBal });
    await base44.entities.Transaction.create({
      user_email: userEmail, type: 'deposit', amount: usdtCost,
      note: `Converted ${numAmt} ${from.symbol} → ${converted} ${to.symbol}`,
    });
    const existing = await base44.entities.CoinHolding.filter({ user_email: userEmail, symbol: to.symbol });
    if (existing.length > 0) {
      await base44.entities.CoinHolding.update(existing[0].id, { amount: +(existing[0].amount + converted).toFixed(8) });
    } else {
      await base44.entities.CoinHolding.create({ user_email: userEmail, symbol: to.symbol, name: to.name, amount: converted, color: to.color, text: to.text });
    }
    setBalance(newBal);
    setAmount('0');
    setLoading(false);
    setSuccess(true);
    toast.success(`Converted ${numAmt} ${from.symbol} → ${converted} ${to.symbol}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background font-inter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold">Convert</h2>
        <div className="w-9" />
      </div>

      {/* Big amount display */}
      <div className="flex-1 flex flex-col px-5">
        <div className="flex items-center justify-between mt-6 mb-2">
          <button onClick={handleMax}
            className="h-9 px-4 rounded-full border border-border text-sm font-semibold text-foreground">
            Max
          </button>
          <p className="text-5xl font-extrabold tracking-tight text-foreground">
            {numAmt > 0 ? numAmt.toLocaleString('en-US', { maximumFractionDigits: 8 }) : '0'}
          </p>
          <button onClick={handleSwap}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="text-center mb-2">
          <p className="text-sm text-muted-foreground font-medium">
            {converted > 0 ? `${converted} ${to.symbol}` : `0 ${to.symbol}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {fromBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {from.symbol} available
          </p>
        </div>

        {/* Rate hint */}
        {numAmt > 0 && (
          <div className="mx-auto bg-primary/8 border border-primary/20 rounded-xl px-4 py-2 mb-4 text-center">
            <p className="text-xs text-primary font-semibold">
              1 {from.symbol} ≈ {(fromRate / toRate).toFixed(8)} {to.symbol}
            </p>
          </div>
        )}

        {/* From / To bar */}
        <div className="flex items-center bg-secondary rounded-2xl px-4 py-3 gap-3 mb-5 border border-border">
          {/* From */}
          <button onClick={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }}
            className="flex-1 flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full ${from.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{from.text}</div>
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground font-medium">From</p>
              <p className="text-sm font-bold">{numAmt > 0 ? numAmt : '0'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
          </button>

          {/* Divider + swap */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 w-px bg-border" />
            <button onClick={handleSwap} className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center shadow-sm">
              <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <div className="h-8 w-px bg-border" />
          </div>

          {/* To */}
          <button onClick={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }}
            className="flex-1 flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full ${to.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{to.text}</div>
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground font-medium">To</p>
              <p className="text-sm font-bold">{converted > 0 ? converted : '0'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
          </button>
        </div>

        {/* Coin pickers */}
        {(showFromPicker || showToPicker) && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {COINS
              .filter(c => showFromPicker ? c.symbol !== to.symbol : c.symbol !== from.symbol)
              .map(c => {
                const active = showFromPicker ? from.symbol === c.symbol : to.symbol === c.symbol;
                return (
                  <button key={c.symbol}
                    onClick={() => {
                      if (showFromPicker) { setFrom(c); setShowFromPicker(false); setAmount('0'); }
                      else { setTo(c); setShowToPicker(false); }
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border transition-all ${active ? 'border-primary bg-primary/5' : 'border-border bg-white'}`}>
                    <div className={`w-6 h-6 rounded-full ${c.color} flex items-center justify-center text-white font-bold text-[10px]`}>{c.text}</div>
                    <span className="text-xs font-semibold">{c.symbol}</span>
                  </button>
                );
              })}
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-emerald-700">Conversion successful! Check your Assets.</p>
          </div>
        )}

        {/* Numpad */}
        {!showFromPicker && !showToPicker && (
          <div className="grid grid-cols-3 gap-1 mb-4">
            {NUMPAD.flat().map((key) => (
              <button key={key} onClick={() => handleNumpad(key)}
                className="h-14 rounded-xl text-xl font-semibold text-foreground bg-secondary/60 hover:bg-secondary active:scale-95 transition-transform flex items-center justify-center">
                {key === '⌫' ? <Delete className="w-5 h-5" /> : key}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-20 pt-2">
        <button onClick={handleConvert} disabled={loading || numAmt <= 0}
          className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base disabled:opacity-50 shadow-lg shadow-primary/30 transition-opacity">
          {loading ? 'Converting...' : 'Convert Now'}
        </button>
      </div>
    </div>
  );
}

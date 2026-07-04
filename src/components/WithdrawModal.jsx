import { useState, useEffect } from 'react';
import { X, ChevronDown, AlertCircle, ArrowUpFromLine, Check, ArrowLeft, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const COINS = [
  { symbol: 'USDT', name: 'Tether', color: 'bg-emerald-500', text: '₮',
    networks: [
      { name: 'TRC20 (TRON)', fee: 1, min: 10, time: '~1 min' },
      { name: 'ERC20 (Ethereum)', fee: 5, min: 20, time: '~5 mins' },
      { name: 'BEP20 (BSC)', fee: 0.5, min: 5, time: '~1 min' },
    ]
  },
  { symbol: 'BTC', name: 'Bitcoin', color: 'bg-orange-500', text: '₿',
    networks: [{ name: 'Bitcoin Network', fee: 0.0002, min: 0.001, time: '~30 mins' }]
  },
  { symbol: 'ETH', name: 'Ethereum', color: 'bg-indigo-500', text: 'Ξ',
    networks: [
      { name: 'ERC20 (Ethereum)', fee: 0.003, min: 0.01, time: '~5 mins' },
      { name: 'BEP20 (BSC)', fee: 0.0005, min: 0.005, time: '~1 min' },
    ]
  },
  { symbol: 'SOL', name: 'Solana', color: 'bg-purple-500', text: '◎',
    networks: [{ name: 'Solana Network', fee: 0.01, min: 0.05, time: '~1 min' }]
  },
  { symbol: 'BNB', name: 'BNB', color: 'bg-yellow-500', text: 'B',
    networks: [
      { name: 'BNB Smart Chain (BEP20)', fee: 0.001, min: 0.01, time: '~1 min' },
      { name: 'opBNB', fee: 0.0005, min: 0.005, time: '~1 min' },
    ]
  },
];

export default function WithdrawModal({ open, onClose, onViewHistory }) {
  const [step, setStep] = useState('main'); // main | network | done
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showCoinPicker, setShowCoinPicker] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep('main');
    setAddress('');
    setAmount('');
    setSelectedNetwork(null);
    setShowCoinPicker(false);
    base44.auth.me().then(u => setUserEmail(u.email)).catch(() => {});
  }, [open]);

  const handleSubmit = async () => {
    if (!address.trim()) { toast.error('Please enter a withdrawal address'); return; }
    if (!selectedNetwork) { toast.error('Please select a network'); return; }
    const numAmt = parseFloat(amount);
    if (!numAmt || numAmt <= 0) { toast.error('Please enter a valid amount'); return; }
    if (numAmt < selectedNetwork.min) { toast.error(`Minimum withdrawal is ${selectedNetwork.min} ${selectedCoin.symbol}`); return; }
    setLoading(true);
    await base44.entities.WithdrawalRequest.create({
      user_email: userEmail,
      coin: selectedCoin.symbol,
      network: selectedNetwork.name,
      address: address.trim(),
      amount: numAmt,
      fee: selectedNetwork.fee,
      status: 'pending',
    });
    setLoading(false);
    setStep('done');
  };

  const handleSaveAddress = () => {
    if (address.trim()) {
      navigator.clipboard.writeText(address.trim()).catch(() => {});
      toast.success('Address saved to clipboard!');
    } else {
      toast.info('No address to save');
    }
  };

  const handleViewHistory = () => {
    onClose();
    if (onViewHistory) onViewHistory();
  };

  if (!open) return null;

  // Full-screen success — no header
  if (step === 'done') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background font-inter">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8">
            <Check className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold mb-3">Withdrawal Successful</h3>
          <p className="text-4xl font-extrabold mb-5">{amount} {selectedCoin.symbol}</p>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Crypto transferred out of Ascendex. Please contact the recipient platform for your transaction receipt.
          </p>
          <div className="mt-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700">Your withdrawal is pending admin approval.</p>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-12">
          <button onClick={handleSaveAddress}
            className="flex-1 h-14 rounded-2xl bg-secondary text-foreground font-bold text-base">
            Save Address
          </button>
          <button onClick={handleViewHistory}
            className="flex-1 h-14 rounded-2xl bg-yellow-400 text-black font-bold text-base">
            View History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background font-inter overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-border">
        <button onClick={step === 'network' ? () => setStep('main') : onClose}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          {step === 'network' ? <ArrowLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
        <h2 className="text-base font-bold">
          {step === 'network' ? 'Choose Network' : `Withdraw ${selectedCoin.symbol}`}
        </h2>
        <div className="w-9" />
      </div>

      {/* Network picker */}
      {step === 'network' && (
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="text-sm font-semibold mb-4">Choose Network for {selectedCoin.symbol}</p>
          <div className="space-y-3">
            {selectedCoin.networks.map(net => (
              <button key={net.name} onClick={() => { setSelectedNetwork(net); setStep('main'); }}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${selectedNetwork?.name === net.name ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                <p className="font-bold text-sm mb-1">{net.name}</p>
                <p className="text-xs text-muted-foreground">Fee {net.fee} {selectedCoin.symbol}</p>
                <p className="text-xs text-muted-foreground">Minimum withdrawal {net.min} {selectedCoin.symbol}</p>
                <p className="text-xs text-muted-foreground">Arrival time ≈ {net.time}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">Ensure the network matches the withdrawal address and the deposit platform supports it, or assets may be lost.</p>
          </div>
        </div>
      )}

      {/* Main form */}
      {step === 'main' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* On-Chain banner */}
          <div className="mx-4 mt-4 shrink-0 bg-secondary rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ArrowUpFromLine className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">On-Chain Withdraw</p>
              <p className="text-xs text-muted-foreground">Withdraw Crypto from Ascendex to other exchanges/wallets</p>
            </div>
          </div>

          {/* Scrollable form fields */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Coin selector */}
            <div>
              <p className="text-sm font-semibold mb-2">Coin</p>
              <button onClick={() => setShowCoinPicker(!showCoinPicker)}
                className="w-full flex items-center gap-3 border border-border rounded-2xl px-4 h-14 bg-secondary/40">
                <div className={`w-8 h-8 rounded-full ${selectedCoin.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{selectedCoin.text}</div>
                <span className="font-bold text-sm flex-1 text-left">{selectedCoin.symbol} <span className="text-muted-foreground font-normal">— {selectedCoin.name}</span></span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {showCoinPicker && (
                <div className="mt-2 border border-border rounded-2xl overflow-hidden bg-white shadow-lg">
                  {COINS.map(c => (
                    <button key={c.symbol} onClick={() => { setSelectedCoin(c); setSelectedNetwork(null); setShowCoinPicker(false); }}
                      className="w-full flex items-center gap-3 px-4 h-14 border-b border-border/50 last:border-0 hover:bg-secondary/50">
                      <div className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{c.text}</div>
                      <span className="font-semibold text-sm">{c.symbol}</span>
                      <span className="text-xs text-muted-foreground">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <p className="text-sm font-semibold mb-2">Address</p>
              <div className="flex items-center border border-border rounded-2xl px-4 h-14 bg-secondary/40">
                <input
                  type="text"
                  placeholder="Long press to paste"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Network */}
            <div>
              <p className="text-sm font-semibold mb-2">Network</p>
              <button onClick={() => setStep('network')}
                className="w-full flex items-center justify-between border border-border rounded-2xl px-4 h-14 bg-secondary/40">
                <span className={`text-sm ${selectedNetwork ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {selectedNetwork ? selectedNetwork.name : 'Select Network'}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {selectedNetwork && (
                <p className="text-xs text-muted-foreground mt-1.5 px-1">
                  Fee: {selectedNetwork.fee} {selectedCoin.symbol} · Arrival: {selectedNetwork.time}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <p className="text-sm font-semibold mb-2">Amount</p>
              <div className="flex items-center border border-border rounded-2xl px-4 h-14 bg-secondary/40">
                <input
                  type="number"
                  placeholder={`Minimum ${selectedNetwork?.min ?? 0}`}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                />
                <span className="text-xs font-bold text-muted-foreground">{selectedCoin.symbol}</span>
                <button className="text-xs font-bold text-primary ml-3">Max</button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Ensure the network matches the withdrawal address and the deposit platform supports it, or assets may be lost.</p>
            </div>

            {/* Submit button inside scroll area, above bottom nav */}
            <button onClick={handleSubmit} disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base disabled:opacity-50 shadow-lg shadow-primary/30 mt-2 mb-24">
              {loading ? 'Submitting...' : 'Submit Withdrawal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

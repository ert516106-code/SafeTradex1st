import { useState, useEffect } from 'react';
import { X, ChevronRight, Copy, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const COIN_META = {
  USDT: { name: 'Tether',    color: 'bg-emerald-500', text: '₮' },
  USDC: { name: 'USD Coin',  color: 'bg-blue-500',    text: '$' },
  BTC:  { name: 'Bitcoin',   color: 'bg-orange-500',  text: '₿' },
  ETH:  { name: 'Ethereum',  color: 'bg-indigo-500',  text: 'Ξ' },
  SOL:  { name: 'Solana',    color: 'bg-purple-500',  text: '◎' },
};

const COIN_ORDER = ['USDT', 'USDC', 'BTC', 'ETH', 'SOL'];

export default function DepositModal({ open, onClose }) {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  useEffect(() => {
    if (!open) return;
    base44.entities.DepositAddress.list().then(records => {
      // Group by symbol
      const grouped = {};
      records.forEach(r => {
        if (!grouped[r.symbol]) grouped[r.symbol] = [];
        grouped[r.symbol].push({ name: r.network, address: r.address });
      });
      const built = COIN_ORDER
        .filter(s => grouped[s])
        .map(s => ({ symbol: s, ...COIN_META[s], networks: grouped[s] }));
      setCoins(built);
    });
  }, [open]);

  const handleClose = () => {
    setSelectedCoin(null);
    setSelectedNetwork(null);
    onClose();
  };

  const handleBack = () => {
    if (selectedNetwork) setSelectedNetwork(null);
    else setSelectedCoin(null);
  };

  const copyAddress = (addr) => {
    navigator.clipboard.writeText(addr);
    toast.success('Address copied!');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border">
        {selectedCoin ? (
          <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-bold flex-1">
          {!selectedCoin ? 'Select Coin' : !selectedNetwork ? `${selectedCoin.symbol} — Select Network` : `Deposit ${selectedCoin.symbol}`}
        </h2>
      </div>

      {/* Coin List */}
      {!selectedCoin && (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-3">POPULAR COINS</p>
          <div className="space-y-1">
            {coins.map(coin => (
              <button key={coin.symbol} onClick={() => setSelectedCoin(coin)}
                className="w-full flex items-center gap-4 py-3 border-b border-border/50">
                <div className={`w-10 h-10 rounded-full ${coin.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {coin.text}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{coin.symbol}</p>
                  <p className="text-xs text-muted-foreground">{coin.name}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Network Selection */}
      {selectedCoin && !selectedNetwork && (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-3">SELECT NETWORK</p>
          <div className="space-y-1">
            {selectedCoin.networks.map(net => (
              <button key={net.name} onClick={() => setSelectedNetwork(net)}
                className="w-full flex items-center justify-between py-4 border-b border-border/50">
                <span className="font-medium text-sm">{net.name}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Deposit Address */}
      {selectedCoin && selectedNetwork && (
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="bg-secondary rounded-2xl p-4 mb-5">
            <p className="text-xs text-muted-foreground mb-1">Network</p>
            <p className="font-semibold text-sm">{selectedNetwork.name}</p>
          </div>

          <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-2">{selectedCoin.symbol} DEPOSIT ADDRESS</p>
          <div className="bg-secondary rounded-2xl p-4 mb-3">
            <p className="text-sm break-all font-mono">{selectedNetwork.address}</p>
          </div>
          <button onClick={() => copyAddress(selectedNetwork.address)}
            className="w-full h-12 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2">
            <Copy className="w-4 h-4" /> Copy Address
          </button>

          <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-1">
            <p className="text-xs font-bold text-yellow-700">⚠️ Important</p>
            <p className="text-xs text-yellow-600">Only send {selectedCoin.symbol} to this address via the <strong>{selectedNetwork.name}</strong> network.</p>
            <p className="text-xs text-yellow-600">Sending other assets or using a wrong network may result in permanent loss.</p>
          </div>
        </div>
      )}
    </div>
  );
}

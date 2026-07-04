import { X, ArrowRight } from 'lucide-react';
import CoinLogo from './CoinLogo';

export default function TransferToStakingModal({ open, onClose, coins, onSelect }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg bg-background rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Transfer to Staking</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-3">Choose a coin to move into staking</p>

        {coins.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">No converted coins available yet.</p>
        ) : (
          <div className="space-y-2">
            {coins.map(coin => (
              <button key={coin.symbol} onClick={() => onSelect(coin)}
                className="w-full flex items-center justify-between p-3 border border-border rounded-xl hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <CoinLogo symbol={coin.symbol} size="sm" />
                  <div className="text-left">
                    <p className="font-bold text-sm">{coin.symbol}</p>
                    <p className="text-xs text-muted-foreground">Available: {coin.available.toLocaleString('en-US', { maximumFractionDigits: 6 })}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

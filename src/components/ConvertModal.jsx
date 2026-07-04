import { useState } from 'react';
import { X, ArrowLeftRight, ChevronDown, Check, Delete } from 'lucide-react';

const COINS = [
  { symbol: 'USDT', name: 'Tether', color: 'bg-emerald-500', text: '₮' },
  { symbol: 'USDC', name: 'USD Coin', color: 'bg-blue-500', text: '$' },
  { symbol: 'BTC', name: 'Bitcoin', color: 'bg-orange-500', text: '₿' },
  { symbol: 'ETH', name: 'Ethereum', color: 'bg-indigo-500', text: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', color: 'bg-purple-500', text: '◎' },
  { symbol: 'BNB', name: 'BNB', color: 'bg-yellow-500', text: 'B' }
];

const RATES = {
  USDT: 1,
  USDC: 1,
  BTC: 68400,
  ETH: 3850,
  SOL: 185,
  BNB: 590
};

const NUMPAD = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  ['.','0','⌫']
];

export default function ConvertModal({ open, onClose }) {
  const [from, setFrom] = useState(COINS[0]);
  const [to, setTo] = useState(COINS[2]);
  const [amount, setAmount] = useState('0');
  const [success, setSuccess] = useState(false);

  const numAmt = parseFloat(amount) || 0;

  const converted =
    numAmt > 0
      ? +(numAmt * RATES[from.symbol] / RATES[to.symbol]).toFixed(8)
      : 0;

  const handleNumpad = (key) => {
    if (key === '⌫') {
      setAmount(prev =>
        prev.length <= 1 ? '0' : prev.slice(0, -1)
      );
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(prev => prev + '.');
      }
    } else {
      setAmount(prev =>
        prev === '0'
          ? key
          : prev + key
      );
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setAmount('0');
  };

  const handleConvert = () => {
    if (numAmt <= 0) return;

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">

      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={onClose}>
          <X />
        </button>

        <h2 className="font-bold">
          Convert
        </h2>

        <div></div>
      </div>

      <div className="px-5">

        <h1 className="text-4xl font-bold text-center">

          {numAmt}

        </h1>

        <p className="text-center mt-2">
          {converted} {to.symbol}
        </p>

        <div className="flex justify-between mt-5">

          <button
            onClick={() => setFrom(to)}
            className="border rounded p-3"
          >
            {from.symbol}
            <ChevronDown size={15}/>
          </button>

          <button
            onClick={handleSwap}
          >
            <ArrowLeftRight/>
          </button>

          <button
            onClick={() => setTo(from)}
            className="border rounded p-3"
          >
            {to.symbol}
            <ChevronDown size={15}/>
          </button>

        </div>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mt-4 flex items-center gap-2">
            <Check size={16}/>
            Conversion Complete
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-6">

          {NUMPAD.flat().map(key => (

            <button
              key={key}
              onClick={() => handleNumpad(key)}
              className="h-14 rounded bg-secondary"
            >

              {key === '⌫'
                ? <Delete/>
                : key}

            </button>

          ))}

        </div>

        <button
          onClick={handleConvert}
          className="w-full bg-primary text-white rounded mt-6 h-12"
        >
          Convert Now
        </button>

      </div>

    </div>
  );
}

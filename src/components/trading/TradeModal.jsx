import { useState, useMemo, useEffect } from 'react';
import { useMarket } from '../../contexts/MarketContext';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import TradingHeader from './TradingHeader';
import TradingChart from './TradingChart';
import TradingTabs from './TradingTabs';
import TradeForm from './TradeForm';
import BalanceCard from './BalanceCard';
import OrderSummary from './OrderSummary';

const periods = [
  { label: '1m', seconds: 60, profit: '+30.00%', rate: 0.30, minAmount: 100 },
  { label: '2m', seconds: 120, profit: '+45.00%', rate: 0.45, minAmount: 2000 },
  { label: '3m', seconds: 180, profit: '+75.00%', rate: 0.75, minAmount: 10000 },
  { label: '5m', seconds: 300, profit: '+100.00%', rate: 1.00, minAmount: 20000 },
];

const quickAmounts = [10, 100, 500, 1000, 5000, 10000, 50000];

function formatMM(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

const CircleTimer = ({ total, remaining }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? remaining / total : 0;
  const offset = circ * (1 - progress);

  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke="#10b981" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)',
        width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981',
        border: '2px solid #fff', boxShadow: '0 0 0 2px #10b981',
      }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: 1 }}>
          {formatMM(remaining)}
        </span>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, valueColor, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ color: '#6b7280' }}>{label}</span>
    <span style={{ fontWeight: bold ? 700 : 500, color: valueColor || '#111' }}>{value}</span>
  </div>
);

export default function TradeModal({
  open,
  onClose,
  type = 'long',
  coin = 'BTC',
  balance = 0,
  currentPrice = 0,
  winMode = 'neutral',
  onTradeComplete,
  onBalanceChange,
}) {
  const { settings } = useSystemSettings();
  const tradingEnabled = settings.trading;

  const [period, setPeriod] = useState(periods[0]);
  const [amount, setAmount] = useState('');
  const [phase, setPhase] = useState('idle');
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState(null);
  const [animatedPrice, setAnimatedPrice] = useState(currentPrice);
  const [entryPrice, setEntryPrice] = useState(currentPrice);

  const timerRef = useRef(null);
  const priceRef = useRef(null);
  const mountedRef = useRef(true);

  const isLong = type === 'long';
  const numAmount = parseFloat(amount) || 0;
  const fee = useMemo(() => +(numAmount * 0.005).toFixed(4), [numAmount]);
  const totalDeduct = useMemo(() => +(numAmount + fee).toFixed(4), [numAmount, fee]);
  const potentialWin = useMemo(() => +(numAmount * period.rate).toFixed(2), [numAmount, period]);

  useEffect(() => {
    if (!open) return;
    setAnimatedPrice(currentPrice);
    setEntryPrice(currentPrice);
  }, [open, currentPrice, coin]);

  useEffect(() => {
    if (phase !== 'countdown') {
      clearInterval(priceRef.current);
      return;
    }
    const win = winMode === 'win' ? true : winMode === 'lose' ? false : Math.random() > 0.5;
    const bias = (isLong ? 1 : -1) * (win ? 1 : -1) * 0.00015;
    priceRef.current = setInterval(() => {
      setAnimatedPrice(prev => {
        const pct = (Math.random() - 0.5) * 0.0006 + bias;
        return +(prev * (1 + pct)).toFixed(2);
      });
    }, 800);
    return () => clearInterval(priceRef.current);
  }, [phase, winMode, isLong]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(priceRef.current);
    };
  }, []);

  const resetModal = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(priceRef.current);
    setPhase('idle');
    setResult(null);
    setAmount('');
    setPeriod(periods[0]);
    setAnimatedPrice(currentPrice);
  }, [currentPrice]);

  const handleClose = useCallback(() => {
    resetModal();
    onClose?.();
  }, [resetModal, onClose]);

  const handleConfirm = useCallback(() => {
    if (!tradingEnabled) return;
    if (numAmount < period.minAmount) {
      return;
    }
    if (numAmount > balance) {
      return;
    }

    const snapEntryPrice = animatedPrice;
    setEntryPrice(snapEntryPrice);

    const balanceAfterDeduction = +(balance - numAmount).toFixed(2);
    onBalanceChange?.(balanceAfterDeduction);

    setPhase('countdown');
    setCountdown(period.seconds);

    // Local countdown display only — resolution itself runs independently below.
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    startTrade({
      coin,
      isLong,
      period,
      numAmount,
      entryPrice: snapEntryPrice,
      potentialWin,
      balanceAfterDeduction,
      winMode,
      onResolve: ({ win, profit, updatedBalance, transaction }) => {
        onBalanceChange?.(updatedBalance);
        onTradeComplete?.(transaction);

        if (!mountedRef.current) return;
        clearInterval(priceRef.current);
        setResult({ win, profit });
        setPhase('result');
      },
    });
  }, [tradingEnabled, numAmount, period, balance, animatedPrice, coin, isLong, potentialWin, winMode, onBalanceChange, onTradeComplete]);

  if (!open) return null;

  const confirmDisabled = !tradingEnabled || numAmount < period.minAmount || numAmount > balance;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleClose}
    >
      <div
        style={{ width: '100%', maxWidth: 512, backgroundColor: '#fff', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 9999, backgroundColor: '#d1d5db' }} />
        </div>

        {phase === 'result' && result && (
          <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: result.win ? '#d1fae5' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              {result.win
                ? <TrendingUp style={{ width: 40, height: 40, color: '#10b981' }} />
                : <TrendingDown style={{ width: 40, height: 40, color: '#ef4444' }} />}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: result.win ? '#10b981' : '#ef4444', marginBottom: 4 }}>
              {result.win ? 'YOU WIN! 🎉' : 'YOU LOST 😔'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>{result.win ? 'Profit earned' : 'Amount lost'}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: result.win ? '#10b981' : '#ef4444', marginBottom: 4 }}>
              {result.win ? '+' : ''}{result.profit.toFixed(2)} USDT
            </p>
            <button
              onClick={handleClose}
              style={{ width: '100%', height: 52, borderRadius: 14, backgroundColor: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        )}

        {phase === 'countdown' && (
          <div style={{ padding: '28px 24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>{coin}</span>
              <button onClick={handleClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: 16, height: 16, color: '#6b7280' }} />
              </button>
            </div>

            <CircleTimer total={period.seconds} remaining={countdown} />

            <div style={{ width: '100%', marginTop: 28, borderTop: '1px solid #f3f4f6', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
              <InfoRow label="Current price" value={animatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
              <InfoRow label="Cycle" value={period.label} />
              <InfoRow label="Direction" value={isLong ? 'Buying up' : 'Buy down'} valueColor={isLong ? '#10b981' : '#ef4444'} />
              <InfoRow label="Quantity" value={`${numAmount.toFixed(2)} USDT`} />
              <InfoRow label="Price" value={`${entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`} />
              <InfoRow label="Expected profit" value={`+${potentialWin} USDT`} valueColor="#10b981" bold />
            </div>

            <p style={{ marginTop: 20, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
              The final price is subject to system settlement.
            </p>
          </div>
        )}

        {phase === 'idle' && (
          <>
            <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 18 }}>{coin}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999, backgroundColor: isLong ? '#10b981' : '#ef4444', color: '#fff' }}>
                    {isLong ? 'Buying up' : 'Buy down'}
                  </span>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 20, height: 20, color: '#6b7280' }} />
                </button>
              </div>

              {!tradingEnabled && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 14px', marginBottom: 20, color: '#b91c1c', fontSize: 13, fontWeight: 600 }}>
                  Trading is temporarily disabled by the platform. Please check back later.
                </div>
              )}

              <p style={{ fontWeight: 600, marginBottom: 12 }}>Select Period</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {periods.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setPeriod(p); setAmount(''); }}
                    disabled={!tradingEnabled}
                    style={{
                      flex: 1, borderRadius: 12, padding: '10px 4px', textAlign: 'center', border: 'none',
                      cursor: (tradingEnabled && balance >= p.minAmount) ? 'pointer' : 'not-allowed',
                      backgroundColor: period.label === p.label ? '#3b82f6' : balance >= p.minAmount ? '#f3f4f6' : '#f9fafb',
                      color: period.label === p.label ? '#fff' : balance >= p.minAmount ? '#111' : '#9ca3af',
                      opacity: (tradingEnabled && balance >= p.minAmount) ? 1 : 0.6,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.label}</div>
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{p.profit}</div>
                    <div style={{ fontSize: 9, marginTop: 2, fontWeight: 600 }}>
                      Min {p.minAmount >= 1000 ? (p.minAmount / 1000) + 'K' : p.minAmount} USDT
                    </div>
                  </button>
                ))}
              </div>

              <p style={{ fontWeight: 600, marginBottom: 12 }}>Purchase volume</p>
              <input
                type="number"
                placeholder={`At least ${period.minAmount >= 1000 ? (period.minAmount / 1000) + 'K' : period.minAmount} USDT`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                disabled={!tradingEnabled}
                style={{ width: '100%', height: 48, border: '1px solid #e5e7eb', borderRadius: 12, padding: '0 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {quickAmounts.map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    disabled={!tradingEnabled}
                    style={{ padding: '8px 14px', borderRadius: 10, backgroundColor: numAmount === a ? '#3b82f6' : '#f3f4f6', color: numAmount === a ? '#fff' : '#111', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                  >
                    {a}
                  </button>
                ))}
              </div>

              <div style={{ backgroundColor: '#f9fafb', borderRadius: 14, padding: 16, marginBottom: 20, fontSize: 14 }}>
                <p style={{ fontWeight: 700, marginBottom: 8 }}>
                  Available balance: {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: 4 }}><span>Fee ratio:</span><span>0.5%</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: 4 }}><span>Fee amount:</span><span>{fee} USDT</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: numAmount > 0 ? 4 : 0 }}><span>Total deduction:</span><span>{totalDeduct} USDT</span></div>
                {numAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                    <span>Potential profit ({period.profit}):</span><span>+{potentialWin} USDT</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '12px 20px 28px', backgroundColor: '#fff', borderTop: '1px solid #f3f4f6' }}>
              <button
                onClick={handleConfirm}
                disabled={confirmDisabled}
                style={{
                  width: '100%', height: 56, borderRadius: 14,
                  backgroundColor: confirmDisabled ? '#9ca3af' : '#10b981',
                  color: '#fff', fontWeight: 700, fontSize: 16, border: 'none',
                  cursor: confirmDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                Confirm Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

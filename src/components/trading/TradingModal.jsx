import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarket } from '../../contexts/MarketContext';
import TradingHeader from './TradingHeader';
import TradingChart from './TradingChart';
import { supabase } from "../../lib/supabase";
import * as tradeService from "../../services/tradeService";

const periods = [
  { label: '1m', seconds: 60, profit: '+30.00%', rate: 0.30, minAmount: 100 },
  { label: '2m', seconds: 120, profit: '+45.00%', rate: 0.45, minAmount: 2000 },
  { label: '3m', seconds: 180, profit: '+75.00%', rate: 0.75, minAmount: 10000 },
  { label: '5m', seconds: 300, profit: '+100.00%', rate: 1.00, minAmount: 20000 },
];

const quickAmounts = [100, 500, 1000, 5000, 10000, 50000];

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
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke="#10b981" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)',
        width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981',
        border: '2px solid #0d1322', boxShadow: '0 0 0 2px #10b981',
      }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', letterSpacing: 1 }}>
          {formatMM(remaining)}
        </span>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, valueColor, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ color: '#94a3b8' }}>{label}</span>
    <span style={{ fontWeight: bold ? 700 : 500, color: valueColor || '#f8fafc' }}>{value}</span>
  </div>
);

export default function TradingModal({
  open,
  onClose,
  type = 'long',
  coin: coinProp = 'BTC',
  coinId,
  balance = 0,
  balanceUSDT = 0,
  balanceCoin = 0,
  currentPrice: currentPriceProp = 0,
  onTradeComplete,
  onOrderComplete,
  onBalanceChange,
}) {
  const { coins } = useMarket();

  const coinObj = useMemo(() => {
    if (coins && coins.length > 0) {
      return coins.find((c) => c.id === coinId) || coins[0] || null;
    }
    return null;
  }, [coins, coinId]);

  const coin = typeof coinProp === 'string' ? coinProp : coinObj?.symbol || 'BTC';
  const currentPrice = currentPriceProp || coinObj?.price || 0;

  const [period, setPeriod] = useState(periods[0]);
  const [amount, setAmount] = useState('');
  const [phase, setPhase] = useState('idle');
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState(null);
  const [animatedPrice, setAnimatedPrice] = useState(currentPrice);
  const [entryPrice, setEntryPrice] = useState(currentPrice);

  const [currentUser, setCurrentUser] = useState(null);
  const [realUsdtBalance, setRealUsdtBalance] = useState(0);

  // --- THE FIX: Reload user AND balance every time modal opens ---
  useEffect(() => {
    async function loadUserAndBalance() {
      if (!open) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user?.id) {
        // Force fetch the absolute latest balance from Supabase every time modal opens
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('usdt')
          .eq('id', user.id)
          .single();
          
        if (!error && profile) {
          const newBalance = profile.usdt || 0;
          setRealUsdtBalance(newBalance);
          // Also update the parent if it has a balance change function
          if (onBalanceChange) {
            onBalanceChange(newBalance);
          }
        }
      }
    }
    loadUserAndBalance();
  }, [open, onBalanceChange]);

  useEffect(() => {
    if (open && currentPrice > 0) {
      setAnimatedPrice(currentPrice);
      setEntryPrice(currentPrice);
    }
  }, [open, currentPrice]);

  const [systemSettings, setSystemSettings] = useState(null);
  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("system_settings")
        .select("*")
        .eq("id", 1)
        .single();
      setSystemSettings(data);
    }
    loadSettings();
  }, []);

  const tradingEnabled = systemSettings?.trading !== false;

  const timerRef = useRef(null);
  const priceRef = useRef(null);
  const mountedRef = useRef(true);
  const animatedPriceRef = useRef(currentPrice);

  useEffect(() => {
    animatedPriceRef.current = animatedPrice;
  }, [animatedPrice]);

  const isLong = type === 'long';
  // Use Real Balance fetched from DB
  const effectiveBalance = realUsdtBalance || balance || balanceUSDT;
  
  const numAmount = parseFloat(amount) || 0;
  const fee = useMemo(() => +(numAmount * 0.005).toFixed(4), [numAmount]);
  const totalDeduct = useMemo(() => +(numAmount + fee).toFixed(4), [numAmount, fee]);
  const potentialWin = useMemo(() => +(numAmount * period.rate).toFixed(2), [numAmount, period]);

  useEffect(() => {
    if (phase !== 'countdown') {
      clearInterval(priceRef.current);
      return;
    }
    let win;
    if (systemSettings?.auto_win) {
      win = true;
    } else if (systemSettings?.auto_lose) {
      win = false;
    } else {
      win = Math.random() > 0.5;
    }
    const bias = (isLong ? 1 : -1) * (win ? 1 : -1) * 0.00015;
    priceRef.current = setInterval(() => {
      setAnimatedPrice(prev => {
        const pct = (Math.random() - 0.5) * 0.0006 + bias;
        return +(prev * (1 + pct)).toFixed(2);
      });
    }, 800);
    return () => clearInterval(priceRef.current);
  }, [phase, isLong, systemSettings]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(priceRef.current);
    };
  }, []);

  const persistTrade = useCallback(async ({ transaction, balanceBefore, balanceAfter }) => {
    if (!currentUser?.id) return;
    try {
      await tradeService.createTrade({
        userId: currentUser.id,
        coin: transaction.coin,
        direction: transaction.isLong ? 'long' : 'short',
        timeframe: transaction.period,
        amount: transaction.amount,
        payoutPercent: +(period.rate * 100).toFixed(2),
        entryPrice: transaction.entryPrice,
        exitPrice: transaction.exitPrice,
        profit: transaction.win ? transaction.profit : -transaction.profit,
        result: transaction.win ? 'win' : 'lose',
        balanceBefore,
        balanceAfter,
      });

      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ usdt: balanceAfter })
        .eq('id', currentUser.id);

      if (balanceError) {
        throw new Error(balanceError.message);
      }
    } catch (err) {
      console.error('Failed to save trade:', err);
    }
  }, [currentUser, period]);

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
    if (numAmount < period.minAmount || numAmount > effectiveBalance) return;

    const snapEntryPrice = animatedPrice;
    setEntryPrice(snapEntryPrice);

    const balanceBeforeTrade = effectiveBalance;
    const balanceAfterDeduction = +(effectiveBalance - numAmount).toFixed(2);
    onBalanceChange?.(balanceAfterDeduction);

    setPhase('countdown');
    setCountdown(period.seconds);

    timerRef.current = setInterval(async () => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          
          const checkAndSettle = async () => {
            let adminMode = 'neutral';
            let activeUserId = currentUser?.id;
            
            try {
              if (!activeUserId) {
                  const { data: { user } } = await supabase.auth.getUser();
                  activeUserId = user?.id;
              }

              if (activeUserId) {
                const { data: profileData, error } = await supabase
                  .from('profiles')
                  .select('mode')
                  .eq('id', activeUserId)
                  .single();

                if (!error && profileData) {
                  adminMode = profileData.mode || 'neutral';
                }
              }
            } catch (err) {
              console.error("Error checking admin mode:", err);
            }

            let win = false;
            
            if (adminMode === 'win') {
              win = true;
            } else if (adminMode === 'lose') {
              win = false;
            } else {
              if (systemSettings?.auto_win) {
                win = true;
              } else if (systemSettings?.auto_lose) {
                win = false;
              } else {
                win = Math.random() > 0.5;
              }
            }

            const profit = win ? potentialWin : numAmount;
            const updatedBalance = win 
              ? +(balanceAfterDeduction + numAmount + potentialWin).toFixed(2)
              : balanceAfterDeduction;
            const exitPrice = animatedPriceRef.current;

            const transaction = {
              coin,
              isLong,
              period: period.label,
              amount: numAmount,
              entryPrice: snapEntryPrice,
              exitPrice,
              win,
              profit,
              timestamp: Date.now(),
            };

            onBalanceChange?.(updatedBalance);
            onTradeComplete?.(transaction);
            onOrderComplete?.(transaction);

            if (activeUserId) {
              await persistTrade({
                transaction,
                balanceBefore: balanceBeforeTrade,
                balanceAfter: updatedBalance,
              });
            }

            if (mountedRef.current) {
              clearInterval(priceRef.current);
              setResult({ win, profit });
              setPhase('result');
            }
          };

          checkAndSettle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [tradingEnabled, numAmount, period, effectiveBalance, animatedPrice, coin, isLong, potentialWin, systemSettings, currentUser, onBalanceChange, onTradeComplete, onOrderComplete, persistTrade]);

  if (!open) return null;

  const confirmDisabled = !tradingEnabled || numAmount < period.minAmount || numAmount > effectiveBalance;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 512,
          backgroundColor: '#0d1322',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          border: '1px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          color: '#f8fafc',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '10px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 9999, backgroundColor: '#334155' }} />
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 14px',
            borderRadius: 20,
            backgroundColor: isLong ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${isLong ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          }}>
            {isLong ? <TrendingUp style={{ width: 16, height: 16, color: '#10b981' }} /> : <TrendingDown style={{ width: 16, height: 16, color: '#ef4444' }} />}
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: isLong ? '#10b981' : '#ef4444' }}>
              {isLong ? 'Buy Long' : 'Sell Short'}
            </span>
          </div>
        </div>

        {coinObj && <TradingHeader coin={coinObj} onBack={handleClose} />}

        {phase === 'result' && result && (
          <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: result.win ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              {result.win ? <TrendingUp style={{ width: 40, height: 40, color: '#10b981' }} /> : <TrendingDown style={{ width: 40, height: 40, color: '#ef4444' }} />}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: result.win ? '#10b981' : '#ef4444', marginBottom: 4 }}>
              {result.win ? 'YOU WIN! 🎉' : 'YOU LOST 😔'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>{result.win ? 'Profit earned' : 'Amount lost'}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: result.win ? '#10b981' : '#ef4444', marginBottom: 24 }}>
              {result.win ? '+' : ''}{result.profit.toFixed(2)} USDT
            </p>
            <button
              onClick={handleClose}
              style={{ width: '100%', height: 52, borderRadius: 14, backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        )}

        {phase === 'countdown' && (
          <div style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>{coin}</span>
              <button onClick={handleClose} style={{ background: '#1e293b', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: 16, height: 16, color: '#94a3b8' }} />
              </button>
            </div>

            <CircleTimer total={period.seconds} remaining={countdown} />

            <div style={{ width: '100%', marginTop: 24, borderTop: '1px solid #1e293b', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <InfoRow label="Current price" value={animatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
              <InfoRow label="Cycle" value={period.label} />
              <InfoRow label="Direction" value={isLong ? 'Buy Long' : 'Sell Short'} valueColor={isLong ? '#10b981' : '#ef4444'} />
              <InfoRow label="Quantity" value={`${numAmount.toFixed(2)} USDT`} />
              <InfoRow label="Price" value={`${entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`} />
              <InfoRow label="Expected profit" value={`+${potentialWin} USDT`} valueColor="#10b981" bold />
            </div>

            <p style={{ marginTop: 18, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
              The final price is subject to system settlement.
            </p>
          </div>
        )}

        {phase === 'idle' && (
          <>
            <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 12px' }}>
              {!coinObj && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>{coin}</span>
                  </div>
                  <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X style={{ width: 20, height: 20, color: '#94a3b8' }} />
                  </button>
                </div>
              )}

              {!tradingEnabled && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: '12px 14px', margin: '12px 0', color: '#f87171', fontSize: 13, fontWeight: 600 }}>
                  Trading is temporarily disabled by the platform. Please check back later.
                </div>
              )}

              {coinObj && <TradingChart coin={coinObj} />}

              <p style={{ fontWeight: 600, marginBottom: 10, marginTop: coinObj ? 14 : 0, color: '#cbd5e1', fontSize: 13 }}>Select Period</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {periods.map(p => {
                  const isSelected = period.label === p.label;
                  const canAfford = effectiveBalance >= p.minAmount;
                  return (
                    <button
                      key={p.label}
                      onClick={() => { setPeriod(p); setAmount(''); }}
                      disabled={!tradingEnabled}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                        padding: '10px 4px',
                        textAlign: 'center',
                        border: isSelected ? '1px solid #6366f1' : '1px solid #1e293b',
                        cursor: (tradingEnabled && canAfford) ? 'pointer' : 'not-allowed',
                        backgroundColor: isSelected ? '#6366f1' : '#131b2e',
                        color: isSelected ? '#fff' : canAfford ? '#e2e8f0' : '#64748b',
                        opacity: (tradingEnabled && canAfford) ? 1 : 0.5,
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.label}</div>
                      <div style={{ fontSize: 10, marginTop: 2, color: isSelected ? '#e0e7ff' : '#34d399', fontWeight: 600 }}>{p.profit}</div>
                      <div style={{ fontSize: 9, marginTop: 2, fontWeight: 600, color: isSelected ? '#c7d2fe' : '#64748b' }}>
                        Min {p.minAmount >= 1000 ? (p.minAmount / 1000) + 'K' : p.minAmount} USDT
                      </div>
                    </button>
                  );
                })}
              </div>

              <p style={{ fontWeight: 600, marginBottom: 10, color: '#cbd5e1', fontSize: 13 }}>Purchase volume</p>
              <input
                type="number"
                placeholder={`At least ${period.minAmount >= 1000 ? (period.minAmount / 1000) + 'K' : period.minAmount} USDT`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                disabled={!tradingEnabled}
                style={{ width: '100%', height: 48, backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: 12, padding: '0 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10, color: '#fff', fontWeight: 600 }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {quickAmounts.map(a => {
                  const isSelected = numAmount === a;
                  return (
                    <button
                      key={a}
                      onClick={() => setAmount(String(a))}
                      disabled={!tradingEnabled}
                      style={{ padding: '8px 14px', borderRadius: 10, backgroundColor: isSelected ? '#6366f1' : '#131b2e', color: isSelected ? '#fff' : '#cbd5e1', border: isSelected ? '1px solid #6366f1' : '1px solid #1e293b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>

              <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: 14, padding: 16, marginBottom: 12, fontSize: 13 }}>
                <p style={{ fontWeight: 700, marginBottom: 10, color: '#fff' }}>
                  Available balance: {effectiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: 6 }}>
                  <span>Fee ratio:</span><span style={{ color: '#cbd5e1' }}>0.5%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: 6 }}>
                  <span>Fee amount:</span><span style={{ color: '#cbd5e1' }}>{fee} USDT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: numAmount > 0 ? 6 : 0 }}>
                  <span>Total deduction:</span><span style={{ color: '#cbd5e1' }}>{totalDeduct} USDT</span>
                </div>
                {numAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600, marginTop: 8, paddingTop: 8, borderTop: '1px solid #1e293b' }}>
                    <span>Potential profit ({period.profit}):</span><span>+{potentialWin} USDT</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '12px 20px 24px', backgroundColor: '#0d1322', borderTop: '1px solid #1e293b' }}>
              <button
                onClick={handleConfirm}
                disabled={confirmDisabled}
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: confirmDisabled ? '#334155' : isLong ? '#10b981' : '#ef4444',
                  color: confirmDisabled ? '#94a3b8' : '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                  border: 'none',
                  cursor: confirmDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: confirmDisabled ? 'none' : isLong ? '0 8px 16px -4px rgba(16, 185, 129, 0.3)' : '0 8px 16px -4px rgba(239, 68, 68, 0.3)',
                }}
              >
                {isLong ? <TrendingUp style={{ width: 20, height: 20 }} /> : <TrendingDown style={{ width: 20, height: 20 }} />}
                <span>{isLong ? 'Confirm Buy Long' : 'Confirm Sell Short'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ConvertForm from "../components/convert/ConvertForm";
import SelectCoin from "../components/convert/SelectCoin";
import ConvertReview from "../components/convert/ConvertReview";
import ConvertLoading from "../components/convert/ConvertLoading";
import ConvertSuccess from "../components/convert/ConvertSuccess";

// ─── SIMPLE TOAST ───
const toast = {
  success: (message) => { console.log('✅', message); alert(message); },
  error: (message) => { console.error('❌', message); alert(message); },
  info: (message) => { console.info('ℹ️', message); alert(message); }
};

// ─── COIN CONFIGURATION ───
export const COINS = [
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A", coingeckoId: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", color: "#627EEA", coingeckoId: "ethereum" },
  { symbol: "SOL", name: "Solana", color: "#9945FF", coingeckoId: "solana" },
  { symbol: "BNB", name: "BNB", color: "#F3BA2F", coingeckoId: "binancecoin" },
  { symbol: "USDT", name: "Tether", color: "#26A17B", coingeckoId: "tether" },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", coingeckoId: "usd-coin" },
  { symbol: "XRP", name: "XRP", color: "#00A4E4", coingeckoId: "ripple" },
  { symbol: "DOGE", name: "Dogecoin", color: "#C2A633", coingeckoId: "dogecoin" },
  { symbol: "ADA", name: "Cardano", color: "#0033AD", coingeckoId: "cardano" },
  { symbol: "TRX", name: "TRON", color: "#EF0027", coingeckoId: "tron" },
  { symbol: "AVAX", name: "Avalanche", color: "#E84142", coingeckoId: "avalanche-2" },
  { symbol: "LINK", name: "Chainlink", color: "#2A5ADA", coingeckoId: "chainlink" },
  { symbol: "DOT", name: "Polkadot", color: "#E6007A", coingeckoId: "polkadot" },
  { symbol: "MATIC", name: "Polygon", color: "#8247E5", coingeckoId: "matic-network" },
  { symbol: "LTC", name: "Litecoin", color: "#345D9D", coingeckoId: "litecoin" },
  { symbol: "SHIB", name: "Shiba Inu", color: "#FFA409", coingeckoId: "shiba-inu" },
  { symbol: "UNI", name: "Uniswap", color: "#FF007A", coingeckoId: "uniswap" },
  { symbol: "ATOM", name: "Cosmos", color: "#5064FB", coingeckoId: "cosmos" },
  { symbol: "NEAR", name: "NEAR Protocol", color: "#00EC97", coingeckoId: "near" },
  { symbol: "APT", name: "Aptos", color: "#2DD8A7", coingeckoId: "aptos" },
  { symbol: "ARB", name: "Arbitrum", color: "#28A0F0", coingeckoId: "arbitrum" },
  { symbol: "OP", name: "Optimism", color: "#FF0420", coingeckoId: "optimism" },
  { symbol: "FIL", name: "Filecoin", color: "#0090FF", coingeckoId: "filecoin" },
  { symbol: "ICP", name: "Internet Computer", color: "#29ABE2", coingeckoId: "internet-computer" },
  { symbol: "ETC", name: "Ethereum Classic", color: "#328332", coingeckoId: "ethereum-classic" },
  { symbol: "BCH", name: "Bitcoin Cash", color: "#8DC351", coingeckoId: "bitcoin-cash" },
  { symbol: "ALGO", name: "Algorand", color: "#00C2A8", coingeckoId: "algorand" },
  { symbol: "VET", name: "VeChain", color: "#15BDFF", coingeckoId: "vechain" },
  { symbol: "SAND", name: "The Sandbox", color: "#00ADEF", coingeckoId: "the-sandbox" },
  { symbol: "MANA", name: "Decentraland", color: "#FF2D55", coingeckoId: "decentraland" },
];

export function getCoin(symbol) {
  return COINS.find((c) => c.symbol === symbol) || COINS[0];
}

// ─── FETCH PRICES FROM COINGECKO ───
export async function fetchCoinPrices() {
  try {
    const ids = COINS.map(c => c.coingeckoId).join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    
    if (!response.ok) throw new Error('Failed to fetch prices');
    
    const data = await response.json();
    
    const prices = {};
    COINS.forEach(coin => {
      prices[coin.symbol] = data[coin.coingeckoId]?.usd || 0;
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return null;
  }
}

const FEE_RATE = 0.001;
const SLIPPAGE = 0.5;

export function computeQuote(fromSymbol, toSymbol, amountInput, prices) {
  const from = getCoin(fromSymbol);
  const to = getCoin(toSymbol);
  const amount = parseFloat(amountInput) || 0;
  
  const fromPrice = prices[fromSymbol] || 0;
  const toPrice = prices[toSymbol] || 0;

  const rate = toPrice > 0 ? fromPrice / toPrice : 0;
  const grossReceive = amount * rate;
  const fee = grossReceive * FEE_RATE;
  const netReceive = grossReceive - fee > 0 ? grossReceive - fee : 0;

  const notional = amount * fromPrice;
  const priceImpact = Math.min(0.35, notional / 4_000_000);

  return {
    from,
    to,
    amount,
    rate,
    fee,
    feeRate: FEE_RATE,
    slippage: SLIPPAGE,
    priceImpact,
    grossReceive,
    netReceive,
    fromPrice,
    toPrice,
  };
}

const initialDraft = {
  fromCoin: "BTC",
  toCoin: "USDT",
  amount: "",
};

const ConvertContext = createContext(null);

export function useConvert() {
  const ctx = useContext(ConvertContext);
  if (!ctx) throw new Error("useConvert must be used inside the Convert flow");
  return ctx;
}

export default function Convert() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(initialDraft);
  const [mounted, setMounted] = useState(false);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [userBalances, setUserBalances] = useState({});
  const [prices, setPrices] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // ─── FETCH USER BALANCES AND PRICES ───
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('No authenticated user found');
          setLoadingBalances(false);
          setLoadingPrices(false);
          setError('Please log in to convert coins');
          return;
        }
        
        setUserId(user.id);
        console.log('User ID:', user.id);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setLoadingBalances(false);
          setLoadingPrices(false);
          setError('Failed to load your balances. Please refresh.');
          return;
        }

        console.log('Profile data:', profile);

        if (profile) {
          const balances = {};
          const balanceFields = [
            'btc', 'eth', 'sol', 'xrp', 'bnb', 'usdt', 'usdc',
            'ada', 'doge', 'trx', 'avax', 'link', 'dot', 'matic',
            'ltc', 'shib', 'uni', 'atom', 'near', 'apt', 'arb',
            'op', 'fil', 'icp', 'etc', 'bch', 'algo', 'vet', 'sand', 'mana'
          ];
          
          balanceFields.forEach((field) => {
            const symbol = field.toUpperCase();
            balances[symbol] = profile[field] || 0;
          });
          
          setUserBalances(balances);
          console.log('User balances:', balances);
        }
        setLoadingBalances(false);

        const priceData = await fetchCoinPrices();
        if (priceData) {
          setPrices(priceData);
          console.log('Prices loaded:', priceData);
        } else {
          // Fallback prices
          const fallbackPrices = {
            BTC: 63200, ETH: 1880, SOL: 73.5, BNB: 587.67,
            USDT: 1, USDC: 1, XRP: 1.09, DOGE: 0.35,
            ADA: 0.85, TRX: 0.28, AVAX: 42, LINK: 24,
            DOT: 8.5, MATIC: 0.75, LTC: 115, SHIB: 0.000025,
            UNI: 9.5, ATOM: 7.8, NEAR: 5.2, APT: 9.8,
            ARB: 0.85, OP: 2.1, FIL: 5.4, ICP: 10.2,
            ETC: 26, BCH: 480, ALGO: 0.18, VET: 0.045,
            SAND: 0.42, MANA: 0.38
          };
          setPrices(fallbackPrices);
        }
        setLoadingPrices(false);

      } catch (err) {
        console.error('Error in fetchUserData:', err);
        setLoadingBalances(false);
        setLoadingPrices(false);
        setError('Failed to load data');
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const resetDraft = () => setDraft(initialDraft);

  const getBalanceForCoin = useCallback((symbol) => {
    return userBalances[symbol] || 0;
  }, [userBalances]);

  const refreshBalances = useCallback(async () => {
    if (!userId) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        const balances = {};
        const balanceFields = [
          'btc', 'eth', 'sol', 'xrp', 'bnb', 'usdt', 'usdc',
          'ada', 'doge', 'trx', 'avax', 'link', 'dot', 'matic',
          'ltc', 'shib', 'uni', 'atom', 'near', 'apt', 'arb',
          'op', 'fil', 'icp', 'etc', 'bch', 'algo', 'vet', 'sand', 'mana'
        ];
        
        balanceFields.forEach((field) => {
          const symbol = field.toUpperCase();
          balances[symbol] = profile[field] || 0;
        });
        
        setUserBalances(balances);
      }
    } catch (err) {
      console.error('Error refreshing balances:', err);
    }
  }, [userId]);

  // ─── CONVERT FUNCTION - UPDATES SUPABASE ───
  const convert = useCallback(async () => {
    const { fromCoin, toCoin, amount } = draft;
    const numAmt = parseFloat(amount) || 0;
    
    console.log('Starting conversion:', { fromCoin, toCoin, amount: numAmt, userId });
    
    if (numAmt <= 0) {
      toast.error("Enter an amount");
      return false;
    }

    const available = getBalanceForCoin(fromCoin);
    console.log(`Available ${fromCoin}:`, available);
    
    if (numAmt > available) {
      toast.error(`Insufficient ${fromCoin} balance. Available: ${available.toFixed(8)} ${fromCoin}`);
      return false;
    }

    const quote = computeQuote(fromCoin, toCoin, amount, prices);
    const netReceive = quote.netReceive;
    console.log('Quote:', quote);
    
    if (netReceive <= 0) {
      toast.error("Conversion amount too low");
      return false;
    }

    setConversionLoading(true);
    
    try {
      const fromField = fromCoin.toLowerCase();
      const toField = toCoin.toLowerCase();
      
      console.log('Updating fields:', { fromField, toField });
      
      // Get current profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`Failed to fetch profile: ${fetchError.message}`);
      }

      console.log('Current profile:', profile);

      // Calculate new balances
      const currentFromBalance = profile[fromField] || 0;
      const currentToBalance = profile[toField] || 0;
      
      const newFromBalance = Math.max(0, currentFromBalance - numAmt);
      const newToBalance = currentToBalance + netReceive;

      console.log('New balances:', { newFromBalance, newToBalance });

      // Update profile in Supabase - REMOVED updated_at column
      const updates = {
        [fromField]: newFromBalance,
        [toField]: newToBalance,
      };

      console.log('Updates to send:', updates);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Failed to update balances: ${updateError.message}`);
      }

      console.log('Update successful!');

      // Update local state
      const newBalances = { ...userBalances };
      newBalances[fromCoin] = newFromBalance;
      newBalances[toCoin] = newToBalance;
      setUserBalances(newBalances);

      toast.success(`✅ Successfully converted ${numAmt} ${fromCoin} → ${netReceive.toFixed(8)} ${toCoin}`);
      resetDraft();
      
      // Navigate to success page
      navigate('/convert/success');
      
      return true;
    } catch (err) {
      console.error('Conversion error:', err);
      toast.error(err.message || "Conversion failed. Please try again.");
      return false;
    } finally {
      setConversionLoading(false);
    }
  }, [draft, userId, userBalances, prices, getBalanceForCoin, navigate]);

  const contextValue = {
    draft,
    updateDraft,
    resetDraft,
    convert,
    conversionLoading,
    getBalanceForCoin,
    fromBalance: getBalanceForCoin(draft.fromCoin),
    toBalance: getBalanceForCoin(draft.toCoin),
    userBalances,
    loadingBalances,
    loadingPrices,
    prices,
    refreshBalances,
    userId,
  };

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'radial-gradient(circle at top, #18254b 0%, #050816 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            {error}
          </h2>
          <button
            onClick={() => navigate('/assets')}
            style={{
              marginTop: '16px',
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              border: 'none',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Assets
          </button>
        </div>
      </div>
    );
  }

  return (
    <ConvertContext.Provider value={contextValue}>
      <div
        className={`fixed inset-0 z-50 overflow-x-hidden overflow-y-auto transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "radial-gradient(circle at top, #18254b 0%, #050816 70%)" }}
      >
        <div
          className="pointer-events-none absolute -left-[12%] -top-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.16] blur-[110px]"
          style={{ background: "#7C3AED" }}
        />
        <div
          className="pointer-events-none absolute -right-[12%] -bottom-[15%] h-[55vmax] w-[55vmax] rounded-full opacity-[0.14] blur-[110px]"
          style={{ background: "#2563EB" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[520px]" style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "520px", width: "100%" }}>
          <Routes>
            <Route index element={<ConvertForm />} />
            <Route path="select-from" element={<SelectCoin field="from" />} />
            <Route path="select-to" element={<SelectCoin field="to" />} />
            <Route path="review" element={<ConvertReview />} />
            <Route path="processing" element={<ConvertLoading />} />
            <Route path="success" element={<ConvertSuccess />} />
            <Route path="*" element={<Navigate to="/convert" replace />} />
          </Routes>
        </div>
      </div>
    </ConvertContext.Provider>
  );
}

// ─── HELPER COMPONENTS ───
export function ConvertHeader({ title, onBack, onClose, right = null }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#050816]/60 px-4 py-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onBack ? onBack : () => navigate('/assets')}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
        aria-label="Back"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 className="text-[17px] font-bold text-white">{title}</h1>

      {right ? right : onClose ? (
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <div className="h-10 w-10" />
      )}
    </div>
  );
}

export function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_30px_-14px_rgba(124,58,237,0.4)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#A78BFA]/50 to-transparent" />
      {children}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] px-6 text-[18px] font-extrabold text-white shadow-[0_14px_36px_-6px_rgba(124,58,237,0.65)] ring-1 ring-white/10 transition-all duration-150 active:scale-[0.97] active:shadow-[0_6px_18px_-4px_rgba(124,58,237,0.5)] ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:brightness-110 hover:shadow-[0_16px_42px_-4px_rgba(124,58,237,0.8)]"
      }`}
      style={{ height: 64, minHeight: 64 }}
    >
      {children}
    </button>
  );
}

const ICON_ID_OVERRIDES = {
  MATIC: "polygon",
};

export function CoinLogo({ coin, size = 36 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const iconId = ICON_ID_OVERRIDES[coin.symbol] || coin.symbol.toLowerCase();
  const iconUrl = `https://assets.coincap.io/assets/icons/${iconId}@2x.png`;

  if (imgFailed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
        style={{ width: size, height: size, background: coin.color, fontSize: size * 0.32 }}
      >
        {coin.symbol.slice(0, 1)}
      </span>
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5"
      style={{ width: size, height: size }}
    >
      <img
        src={iconUrl}
        alt={coin.symbol}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </span>
  );
}

export function formatAmount(value, maxDecimals = 6) {
  if (!isFinite(value)) return "0";
  const rounded = Number(value.toFixed(maxDecimals));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
}

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase"; // Added Supabase import
import {
  DepositCoinLogo,
  DepositHeader,
  GlassCard,
  getNetworksForCoin,
  useDeposit,
} from "../../pages/Deposit";
import { getWalletAddress } from "../../services/walletAddressService";

export default function DepositDetails() {
  const navigate = useNavigate();
  const { selection } = useDeposit();
  const { coin, networkId } = selection;
  const [copied, setCopied] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);

  const network = useMemo(() => {
    if (!coin || !networkId) return null;
    return getNetworksForCoin(coin.symbol).find((n) => n.id === networkId) || null;
  }, [coin, networkId]);

  // --- UPDATED USE EFFECT TO FETCH USER ID AND WALLET ADDRESS ---
  useEffect(() => {
    let active = true;

    if (!coin || !networkId) {
      setWallet(null);
      setWalletLoading(false);
      return;
    }

    setWalletLoading(true);
    
    // 1. Get the logged-in user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;
      if (!user) {
        setWallet(null);
        setWalletLoading(false);
        return;
      }

      // 2. Pass the user.id, coin symbol, and network ID to getWalletAddress
      getWalletAddress(user.id, coin.symbol, networkId)
        .then((data) => {
          if (active) setWallet(data);
        })
        .finally(() => {
          if (active) setWalletLoading(false);
        });
    });

    return () => {
      active = false;
    };
  }, [coin, networkId]);

  const address = wallet?.address || "";

  if (!coin || !network) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col">
        <DepositHeader title="Deposit Details" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-[14px] text-white/50">No deposit details found.</p>
          <button onClick={() => navigate("/deposit/select-coin")} className="text-[13px] font-semibold text-[#A78BFA]">
            Start a new deposit
          </button>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <DepositHeader title="Deposit Details" />

      <div className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-6 sm:px-6">
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <DepositCoinLogo coin={coin} size={48} />
          <span className="text-[18px] font-extrabold text-white">
            {coin.symbol} <span className="text-white/40">({coin.name})</span>
          </span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-[11.5px] font-semibold text-white/50">
            {network.name} · {network.subtitle}
          </span>
        </div>

        <GlassCard className="flex flex-col gap-3 !p-4">
          <Row label="Coin" value={`${coin.name} (${coin.symbol})`} />
          <Row label="Network" value={network.name} />
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 !p-4">
          <span className="text-[12.5px] font-semibold text-white/45">Wallet Address</span>

          {walletLoading ? (
            <div className="break-all rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-[13.5px] text-white/40">
              Loading address...
            </div>
          ) : address ? (
            <>
              <div className="break-all rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-[13.5px] text-white">
                {address}
              </div>
              {wallet?.memo ? (
                <div className="break-all rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-[13.5px] text-white/70">
                  Memo: {wallet.memo}
                </div>
              ) : null}
            </>
          ) : (
            <div className="break-all rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-[13.5px] text-white/50">
              Wallet address not configured.
            </div>
          )}

          <button
            onClick={handleCopy}
            disabled={!address}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] py-3.5 text-[14.5px] font-bold text-white shadow-[0_10px_28px_-8px_rgba(124,58,237,0.6)] transition-all duration-150 hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="11" height="11" rx="2" stroke="#fff" strokeWidth="2" />
                  <path d="M5 15V5a2 2 0 012-2h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Copy Address
              </>
            )}
          </button>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2.5 !p-4">
          <span className="text-[12.5px] font-semibold text-white/45">Important Deposit Instructions</span>
          <ul className="flex flex-col gap-2 text-[13px] leading-snug text-white/70">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A78BFA]" />
              Send only {coin.symbol} to this address using the {network.name} network.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A78BFA]" />
              Sending any other asset or using the wrong network may result in permanent loss of funds.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A78BFA]" />
              Deposits typically require network confirmations before funds are credited.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A78BFA]" />
              Deposit addresses are securely managed by the SafeTradeX Admin Dashboard.
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-[12.5px] text-white/45">{label}</span>
      <span className="text-[13px] font-semibold text-white/85">{value}</span>
    </div>
  );
}

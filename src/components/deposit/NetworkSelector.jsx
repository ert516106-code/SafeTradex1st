import React from "react";
import { useNavigate } from "react-router-dom";
import { DepositCoinLogo, DepositHeader, getNetworksForCoin, useDeposit } from "../../pages/Deposit";

export default function NetworkSelector() {
  const navigate = useNavigate();
  const { selection, updateSelection } = useDeposit();
  const { coin } = selection;

  if (!coin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col">
        <DepositHeader title="Select Network" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-[14px] text-white/50">No coin selected.</p>
          <button onClick={() => navigate("/deposit/select-coin")} className="text-[13px] font-semibold text-[#A78BFA]">
            Choose a coin
          </button>
        </div>
      </div>
    );
  }

  const networks = getNetworksForCoin(coin.symbol);

  const handleSelect = (network) => {
    updateSelection({ networkId: network.id });
    navigate("/deposit/details");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <DepositHeader title="Select Network" />

      <div className="flex flex-col items-center gap-2 px-6 pb-2 pt-6 text-center">
        <DepositCoinLogo coin={coin} size={44} />
        <span className="text-[15px] font-bold text-white">{coin.symbol}</span>
        <span className="text-[12.5px] text-white/40">Choose the network for your deposit</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-5">
        <div className="flex flex-col gap-1.5">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => handleSelect(network)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition-all duration-150 hover:bg-white/[0.07] active:scale-[0.98]"
            >
              <span>
                <span className="block text-[15px] font-semibold text-white">{network.name}</span>
                <span className="block text-[12.5px] text-white/40">{network.subtitle}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

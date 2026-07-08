import { X } from "lucide-react";
import CoinLogo from "../CoinLogo";

export default function CoinDetailsModal({
  open,
  onClose,
  coin,
}) {
  if (!open || !coin) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center">
      <div className="w-full h-full md:h-[95vh] md:max-w-md bg-white dark:bg-zinc-900 overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {coin.name}
            </h2>
            <p className="text-sm text-gray-500">
              {coin.symbol}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* Coin */}
        <div className="px-5 py-6 flex flex-col items-center">

          <CoinLogo symbol={coin.symbol} size="md" />

          <h1 className="mt-3 text-2xl font-bold">
            {coin.name}
          </h1>

          <p className="text-gray-500">
            {coin.symbol}
          </p>

          <p className="mt-5 text-3xl font-bold">
            Live Price
          </p>

          <p className="text-green-500 font-semibold">
            +0.00%
          </p>
        </div>

        {/* Holdings */}
        <div className="mx-5 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 mb-5">
          <h3 className="font-semibold mb-3">
            Your Holdings
          </h3>

          <p className="text-2xl font-bold">
            0.000000 {coin.symbol}
          </p>

          <p className="text-gray-500">
            ≈ $0.00 USD
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 px-5 mb-6">

          <button className="rounded-xl bg-green-600 text-white py-3 font-semibold">
            Buy
          </button>

          <button className="rounded-xl bg-red-600 text-white py-3 font-semibold">
            Sell
          </button>

          <button className="rounded-xl bg-blue-600 text-white py-3 font-semibold">
            Convert
          </button>

          <button className="rounded-xl bg-yellow-500 text-white py-3 font-semibold">
            Deposit
          </button>

          <button className="col-span-2 rounded-xl bg-gray-700 text-white py-3 font-semibold">
            Withdraw
          </button>

        </div>

        {/* TradingView Placeholder */}
        <div className="px-5 mb-6">
          <h3 className="font-semibold mb-3">
            Live Market Chart
          </h3>

          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 h-64 flex items-center justify-center">
            TradingView Chart Coming Soon
          </div>

          <p className="text-center text-xs text-gray-500 mt-2">
            Powered by TradingView
          </p>
        </div>

        {/* Market Statistics */}
        <div className="px-5 mb-6">
          <h3 className="font-semibold mb-3">
            Market Statistics
          </h3>

          <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 divide-y">

            <div className="flex justify-between p-4">
              <span>24H High</span>
              <span>--</span>
            </div>

            <div className="flex justify-between p-4">
              <span>24H Low</span>
              <span>--</span>
            </div>

            <div className="flex justify-between p-4">
              <span>Market Cap</span>
              <span>--</span>
            </div>

            <div className="flex justify-between p-4">
              <span>24H Volume</span>
              <span>--</span>
            </div>

            <div className="flex justify-between p-4">
              <span>Circulating Supply</span>
              <span>--</span>
            </div>

          </div>
        </div>

        {/* About */}
        <div className="px-5 pb-10">
          <h3 className="font-semibold mb-3">
            About {coin.name}
          </h3>

          <p className="text-gray-500 leading-7">
            {coin.description}
          </p>
        </div>

      </div>
    </div>
  );
}

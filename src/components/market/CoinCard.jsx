import CoinLogo from "../CoinLogo";

export default function CoinCard({
  coin,
  price = 0,
  change = 0,
  onClick,
}) {
  const isPositive = change >= 0;

  return (
    <button
      onClick={() => onClick?.(coin)}
      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-blue-500 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <CoinLogo symbol={coin.symbol} />

        <div className="text-left">
          <h3 className="font-semibold text-base">
            {coin.name}
          </h3>

          <p className="text-sm text-gray-500">
            {coin.symbol}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">
          $
          {Number(price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <p
          className={`text-sm font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {Number(change).toFixed(2)}%
        </p>
      </div>
    </button>
  );
}

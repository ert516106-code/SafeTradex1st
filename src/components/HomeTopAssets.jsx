import CoinLogo from "./CoinLogo";

export default function HomeTopAssets({
  assets,
  navigate,
}) {
  return (
    <div className="mx-5 mt-6">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-lg font-bold">
          Top Assets
        </h2>

        <button
          onClick={() => navigate("/markets")}
          className="text-sky-400 text-sm font-medium"
        >
          View All
        </button>

      </div>

      <div className="space-y-3">

        {assets.map((asset) => (

          <button
            key={asset.symbol}
            onClick={() => navigate("/markets")}
            className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 hover:bg-slate-800 transition"
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <CoinLogo
                  symbol={asset.symbol}
                  size="sm"
                />

                <div className="text-left">

                  <p className="font-semibold">
                    {asset.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {asset.symbol}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="font-semibold">

                  $
                  {Number(asset.price).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}

                </p>

                <p
                  className={`text-sm font-medium ${
                    asset.change >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {asset.change >= 0 ? "+" : ""}
                  {asset.change.toFixed(2)}%
                </p>

              </div>

            </div>

          </button>

        ))}

      </div>

    </div>
  );
}

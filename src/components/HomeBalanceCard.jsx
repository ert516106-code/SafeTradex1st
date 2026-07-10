import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

export default function HomeBalanceCard({
  balance,
  todayProfit,
  hideBalance,
  setHideBalance,
  onDeposit,
  onWithdraw,
  onConvert,
}) {
  return (
    <div className="mx-5 mt-5 rounded-3xl overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 p-6 shadow-2xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-blue-100 text-sm">
            Total Portfolio
          </p>

          <div className="flex items-center gap-2 mt-2">

            <h2 className="text-4xl font-bold text-white">

              {hideBalance
                ? "••••••••"
                : `$${balance.toLocaleString()}`
              }

            </h2>

            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="text-white"
            >
              {hideBalance ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <p className="mt-3 text-green-300 font-semibold">
            +${todayProfit} Today
          </p>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">

        <Button
          onClick={onDeposit}
          className="rounded-xl"
        >
          Deposit
        </Button>

        <Button
          onClick={onWithdraw}
          variant="secondary"
          className="rounded-xl"
        >
          Withdraw
        </Button>

        <Button
          onClick={onConvert}
          variant="outline"
          className="rounded-xl"
        >
          Convert
        </Button>

      </div>

    </div>
  );
}

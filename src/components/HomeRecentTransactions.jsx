import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "Deposit",
    asset: "USDT",
    amount: "+500.00",
    time: "Today",
  },
  {
    id: 2,
    type: "Trade",
    asset: "BTC",
    amount: "-0.0021",
    time: "Today",
  },
  {
    id: 3,
    type: "Withdrawal",
    asset: "USDT",
    amount: "-100.00",
    time: "Yesterday",
  },
];

export default function HomeRecentTransactions() {
  return (
    <section className="mx-5 mt-6 mb-6">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-lg font-bold text-white">
          Recent Transactions
        </h2>

        <button className="text-sky-400 text-sm">
          View All
        </button>

      </div>

      <div className="space-y-3">

        {transactions.map((tx) => (

          <div
            key={tx.id}
            className="flex items-center justify-between rounded-2xl bg-slate-900 border border-slate-800 p-4"
          >

            <div className="flex items-center gap-3">

              <div className="h-11 w-11 rounded-full bg-slate-800 flex items-center justify-center">

                {tx.type === "Deposit" ? (
                  <ArrowDownLeft
                    className="text-green-400"
                    size={20}
                  />
                ) : (
                  <ArrowUpRight
                    className="text-red-400"
                    size={20}
                  />
                )}

              </div>

              <div>

                <p className="font-semibold text-white">
                  {tx.type}
                </p>

                <p className="text-sm text-slate-400">
                  {tx.asset}
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="font-semibold text-white">
                {tx.amount}
              </p>

              <p className="text-xs text-slate-500">
                {tx.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

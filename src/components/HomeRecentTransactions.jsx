import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

export default function HomeRecentTransactions({
  transactions = [],
}) {
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

      {transactions.length === 0 ? (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">

          No recent transactions.

        </div>

      ) : (

        <div className="space-y-3">

          {transactions.map((tx) => (

            <div
              key={tx.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800">

                  {tx.type === "Deposit" ? (
                    <ArrowDownLeft
                      size={20}
                      className="text-green-400"
                    />
                  ) : (
                    <ArrowUpRight
                      size={20}
                      className="text-red-400"
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

      )}

    </section>
  );
}

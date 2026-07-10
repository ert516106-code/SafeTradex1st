import {
  Bell,
  ChevronRight,
} from "lucide-react";

const news = [
  {
    id: 1,
    title: "Welcome to SafeTradex",
    description: "Start trading digital assets securely.",
  },
  {
    id: 2,
    title: "Install SafeTradex",
    description: "Use the Install App button for a better experience.",
  },
  {
    id: 3,
    title: "More features coming soon",
    description: "Copy Trading, Loans and Staking are under development.",
  },
];

export default function HomeNews() {
  return (
    <section className="mx-5 mt-6">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-lg font-bold text-white">
          Announcements
        </h2>

        <button className="text-sky-400 text-sm flex items-center gap-1">
          View All
          <ChevronRight size={16} />
        </button>

      </div>

      <div className="space-y-3">

        {news.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-4"
          >

            <div className="flex gap-3">

              <Bell
                size={20}
                className="text-sky-400 mt-1"
              />

              <div>

                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {item.description}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

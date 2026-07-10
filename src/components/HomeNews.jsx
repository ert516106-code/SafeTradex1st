import {
  Bell,
  ChevronRight,
} from "lucide-react";

export default function HomeNews({
  news = [],
}) {
  return (
    <section className="mx-5 mt-6">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-lg font-bold text-white">
          Announcements
        </h2>

        <button className="flex items-center gap-1 text-sky-400 text-sm">
          View All
          <ChevronRight size={16} />
        </button>

      </div>

      <div className="space-y-3">

        {news.length === 0 ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">

            No announcements available.

          </div>

        ) : (

          news.map((item) => (

            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >

              <div className="flex gap-3">

                <Bell
                  size={20}
                  className="mt-1 text-sky-400"
                />

                <div>

                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </section>
  );
}

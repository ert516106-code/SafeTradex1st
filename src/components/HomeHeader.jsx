import { Bell } from "lucide-react";

export default function HomeHeader({
  onProfile,
}) {
  return (
    <header className="px-5 pt-6 pb-4 flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          SafeTradex
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Digital Asset Exchange
        </p>

      </div>

      <div className="flex items-center gap-3">

        <button
          className="relative h-11 w-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition"
        >
          <Bell
            size={20}
            className="text-white"
          />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <button
          onClick={onProfile}
          className="h-11 w-11 rounded-full bg-sky-600 text-white font-bold hover:bg-sky-500 transition"
        >
          👤
        </button>

      </div>

    </header>
  );
}

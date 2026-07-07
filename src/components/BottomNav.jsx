import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LineChart,
  CandlestickChart,
  PiggyBank,
  Wallet,
} from "lucide-react";

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/markets", icon: LineChart, label: "Markets" },
  { path: "/trade", icon: CandlestickChart, label: "Trade" },
  { path: "/financial", icon: PiggyBank, label: "Financial" },
  { path: "/assets", icon: Wallet, label: "Assets" },
];

const VISIBLE_PAGES = [
  "/home",
  "/markets",
  "/trade",
  "/financial",
  "/assets",
  "/coins",
  "/staking",
];

export default function BottomNav() {
  const location = useLocation();

  if (!VISIBLE_PAGES.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-md">
      <div className="flex justify-around items-center bg-white rounded-full shadow-xl border py-2 px-2">

        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`p-2 rounded-full transition ${
                  active ? "bg-blue-100" : ""
                }`}
              >
                <Icon
                  size={22}
                  className={
                    active ? "text-blue-600" : "text-gray-500"
                  }
                />
              </div>

              <span
                className={`text-xs mt-1 ${
                  active
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}

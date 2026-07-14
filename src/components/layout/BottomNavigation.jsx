import {
  House,
  ChartNoAxesColumn,
  CandlestickChart,
  Newspaper,
  Wallet,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Home",
    path: "/home",
    icon: House,
  },
  {
    title: "Markets",
    path: "/markets",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Trade",
    path: "/trade",
    icon: CandlestickChart,
  },
  {
    title: "Financial",
    path: "/financial",
    icon: Newspaper,
  },
  {
    title: "Assets",
    path: "/assets",
    icon: Wallet,
  },
];

export default function BottomNavigation() {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 999,
        padding: "0 12px 18px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          background: "rgba(10,18,40,.92)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(124,92,255,.20)",
          borderRadius: 24,
          padding: "12px 10px",
          boxShadow:
            "0 15px 40px rgba(0,0,0,.35)",
        }}
      >
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive
                  ? "#7C5CFF"
                  : "#94A3B8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
              })}
            >
              {({ isActive }) => (
                <>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      background: isActive
                        ? "linear-gradient(135deg,#7C5CFF,#4F8CFF)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: ".25s",
                      boxShadow: isActive
                        ? "0 0 18px rgba(124,92,255,.45)"
                        : "none",
                    }}
                  >
                    <Icon
                      size={21}
                      color="#fff"
                    />
                  </div>

                  <span>{item.title}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
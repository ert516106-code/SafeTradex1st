import { useState } from "react";
import { X, Clock, ChevronDown } from "lucide-react";

// Keep in sync with whatever countries your CountrySelect offers at signup —
// every country a trader can register with should have a matching zone here.
const COUNTRY_TZ = {
  Italy: "Europe/Rome", France: "Europe/Paris", Germany: "Europe/Berlin",
  Switzerland: "Europe/Zurich", Netherlands: "Europe/Amsterdam", Ireland: "Europe/Dublin",
  "United Kingdom": "Europe/London", Norway: "Europe/Oslo", Spain: "Europe/Madrid",
  Portugal: "Europe/Lisbon", Sweden: "Europe/Stockholm", Poland: "Europe/Warsaw",
  Belgium: "Europe/Brussels", Austria: "Europe/Vienna", Denmark: "Europe/Copenhagen",
  Finland: "Europe/Helsinki", Greece: "Europe/Athens",
  India: "Asia/Kolkata", Singapore: "Asia/Singapore", Japan: "Asia/Tokyo",
  Australia: "Australia/Sydney", "United Arab Emirates": "Asia/Dubai",
  Brazil: "America/Sao_Paulo", "South Africa": "Africa/Johannesburg",
  "United States": "America/New_York",
};

const ZONES = [
  { code: "auto", flag: "🌐", label: "Auto", tz: null, group: null },
  { code: "IT", flag: "🇮🇹", label: "Italy", tz: "Europe/Rome", group: "Europe" },
  { code: "FR", flag: "🇫🇷", label: "France", tz: "Europe/Paris", group: "Europe" },
  { code: "DE", flag: "🇩🇪", label: "Germany", tz: "Europe/Berlin", group: "Europe" },
  { code: "CH", flag: "🇨🇭", label: "Switzerland", tz: "Europe/Zurich", group: "Europe" },
  { code: "NL", flag: "🇳🇱", label: "Netherlands", tz: "Europe/Amsterdam", group: "Europe" },
  { code: "IE", flag: "🇮🇪", label: "Ireland", tz: "Europe/Dublin", group: "Europe" },
  { code: "GB", flag: "🇬🇧", label: "United Kingdom", tz: "Europe/London", group: "Europe" },
  { code: "NO", flag: "🇳🇴", label: "Norway (Oslo)", tz: "Europe/Oslo", group: "Europe" },
  { code: "ES", flag: "🇪🇸", label: "Spain", tz: "Europe/Madrid", group: "Europe" },
  { code: "PT", flag: "🇵🇹", label: "Portugal", tz: "Europe/Lisbon", group: "Europe" },
  { code: "SE", flag: "🇸🇪", label: "Sweden", tz: "Europe/Stockholm", group: "Europe" },
  { code: "PL", flag: "🇵🇱", label: "Poland", tz: "Europe/Warsaw", group: "Europe" },
  { code: "BE", flag: "🇧🇪", label: "Belgium", tz: "Europe/Brussels", group: "Europe" },
  { code: "AT", flag: "🇦🇹", label: "Austria", tz: "Europe/Vienna", group: "Europe" },
  { code: "DK", flag: "🇩🇰", label: "Denmark", tz: "Europe/Copenhagen", group: "Europe" },
  { code: "FI", flag: "🇫🇮", label: "Finland", tz: "Europe/Helsinki", group: "Europe" },
  { code: "GR", flag: "🇬🇷", label: "Greece", tz: "Europe/Athens", group: "Europe" },
  { code: "US-NY", flag: "🇺🇸", label: "United States (New York)", tz: "America/New_York", group: "Other regions" },
  { code: "US-LA", flag: "🇺🇸", label: "United States (Los Angeles)", tz: "America/Los_Angeles", group: "Other regions" },
  { code: "IN", flag: "🇮🇳", label: "India", tz: "Asia/Kolkata", group: "Other regions" },
  { code: "SG", flag: "🇸🇬", label: "Singapore", tz: "Asia/Singapore", group: "Other regions" },
  { code: "JP", flag: "🇯🇵", label: "Japan", tz: "Asia/Tokyo", group: "Other regions" },
  { code: "AU", flag: "🇦🇺", label: "Australia (Sydney)", tz: "Australia/Sydney", group: "Other regions" },
  { code: "AE", flag: "🇦🇪", label: "UAE", tz: "Asia/Dubai", group: "Other regions" },
  { code: "BR", flag: "🇧🇷", label: "Brazil (São Paulo)", tz: "America/Sao_Paulo", group: "Other regions" },
  { code: "ZA", flag: "🇿🇦", label: "South Africa", tz: "Africa/Johannesburg", group: "Other regions" },
];

function fmtMoney(n) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// "2m" / "1h" / "3d" -> milliseconds, used to estimate open time when
// there's no separate opened_at column on the trade row.
function parseTimeframeMs(tf) {
  const match = String(tf || "").match(/^(\d+)\s*([smhd])$/i);
  if (!match) return 0;
  const value = Number(match[1]);
  const mult = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (mult[match[2].toLowerCase()] || 0);
}

function offsetLabel(tz) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value || "";
  } catch {
    return "";
  }
}

function fmtDate(date, tz) {
  const d = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  const t = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(date);
  return `${d} ${t}`;
}

function Row({ label, value, sub, valueClass = "text-white" }) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/5">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`text-right font-semibold ${valueClass}`}>
        {value}
        {sub && <span className="block text-[10.5px] text-slate-500 font-normal mt-0.5">{sub}</span>}
      </span>
    </div>
  );
}

export default function TradeDetailsModal({ trade, accountCountry, onClose }) {
  const [selectedZone, setSelectedZone] = useState(ZONES[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!trade) return null;

  const isWin = trade.result === "win";
  const isLong = trade.direction === "long";
  const pnl = Math.abs(Number(trade.profit));
  const pct = trade.amount ? (pnl / Number(trade.amount)) * 100 : 0;

  const closeUtc = trade.closed_at ? new Date(trade.closed_at) : new Date(trade.created_at);
  const openUtc = trade.opened_at
    ? new Date(trade.opened_at)
    : new Date(closeUtc.getTime() - parseTimeframeMs(trade.timeframe));

  const accountTz = (accountCountry && COUNTRY_TZ[accountCountry]) || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const activeTz = selectedZone.tz || accountTz;
  const off = offsetLabel(activeTz);
  let lastGroup;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-[#10131d] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:pb-5 max-h-[88vh] overflow-y-auto">
        <div className="w-9 h-1 bg-white/10 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="relative flex items-center justify-center mb-5">
          <button onClick={onClose} className="absolute left-0 text-white">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-white font-extrabold text-[17px]">Trade Details</h2>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              ₿
            </div>
            <div>
              <p className="text-white font-extrabold text-lg">{trade.coin}/USDT</p>
              <p className="text-slate-400 text-sm">
                Perpetual · {isLong ? "Long" : "Short"}{trade.leverage ? ` · ${trade.leverage}x` : ""}
              </p>
            </div>
          </div>
          <span className="bg-emerald-500/15 text-emerald-400 text-sm font-bold px-4 py-1.5 rounded-full">Closed</span>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-5 pt-5 pb-1">
          <p className="text-slate-400 text-sm mb-1">Realized P&amp;L</p>
          <p className={`font-extrabold text-3xl ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
            {isWin ? "+" : "-"}{fmtMoney(pnl)} USDT
          </p>
          <p className={`text-sm font-bold mb-4 ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
            ({isWin ? "+" : "-"}{pct.toFixed(2)}%)
          </p>

          <div className="relative flex items-center justify-between py-3 border-t border-white/5">
            <span className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Clock className="w-3.5 h-3.5" /> Times shown in
            </span>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                {selectedZone.code === "auto" ? `Auto (${accountCountry || "device"})` : `${selectedZone.flag} ${selectedZone.label}`}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-60 max-h-72 overflow-y-auto bg-[#171b28] border border-white/10 rounded-xl p-1.5 shadow-xl">
                  {ZONES.map((z) => {
                    const showHeading = z.group !== lastGroup;
                    lastGroup = z.group;
                    return (
                      <div key={z.code}>
                        {showHeading && z.group && (
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 pt-2 pb-1">
                            {z.group}
                          </div>
                        )}
                        <div
                          onClick={() => { setSelectedZone(z); setMenuOpen(false); }}
                          className={`flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm hover:bg-white/5 ${
                            z.code === selectedZone.code ? "text-emerald-400 font-bold" : "text-white"
                          }`}
                        >
                          <span>{z.flag} {z.label}</span>
                          <span className="text-slate-500 text-[11px]">
                            {z.code === "auto" ? offsetLabel(accountTz) : offsetLabel(z.tz)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <Row label="Entry Price" value={fmtMoney(trade.entry_price)} />
          <Row label="Exit Price" value={fmtMoney(trade.exit_price)} />
          <Row label="Position Size" value={`${fmtMoney(trade.amount)} USDT`} />
          {trade.leverage && <Row label="Leverage" value={`${trade.leverage}x`} />}
          <Row label="Position Side" value={isLong ? "Long" : "Short"} valueClass={isLong ? "text-emerald-400" : "text-rose-400"} />
          <Row label="Open Time" value={fmtDate(openUtc, activeTz)} sub={off} />
          <Row label="Close Time" value={fmtDate(closeUtc, activeTz)} sub={off} />

          <div className="flex items-center justify-between py-4 border-t border-white/5 mt-1">
            <span className="text-slate-400 text-sm">Total P&amp;L</span>
            <span>
              <span className={`font-extrabold ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                {isWin ? "+" : "-"}{fmtMoney(pnl)} USDT
              </span>
              <span className={`text-sm font-bold ml-1.5 ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                ({isWin ? "+" : "-"}{pct.toFixed(2)}%)
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 rounded-2xl font-bold text-white"
          style={{ background: "linear-gradient(135deg, #6a5cf0, #4c6df5)" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

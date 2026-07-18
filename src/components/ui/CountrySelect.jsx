import { useState, useRef, useEffect } from "react";
import { countries as rawCountries } from "../../lib/countries";

// Common country name -> ISO 3166-1 alpha-2 code, so flags render
// even if lib/countries.js only stores plain names.
const CODE_MAP = {
  "Afghanistan":"AF","Albania":"AL","Algeria":"DZ","Argentina":"AR","Armenia":"AM",
  "Australia":"AU","Austria":"AT","Azerbaijan":"AZ","Bahrain":"BH","Bangladesh":"BD",
  "Belarus":"BY","Belgium":"BE","Bolivia":"BO","Brazil":"BR","Bulgaria":"BG",
  "Cambodia":"KH","Cameroon":"CM","Canada":"CA","Chile":"CL","China":"CN",
  "Colombia":"CO","Croatia":"HR","Cuba":"CU","Cyprus":"CY","Czech Republic":"CZ",
  "Denmark":"DK","Ecuador":"EC","Egypt":"EG","Estonia":"EE","Ethiopia":"ET",
  "Finland":"FI","France":"FR","Georgia":"GE","Germany":"DE","Ghana":"GH",
  "Greece":"GR","Guatemala":"GT","Honduras":"HN","Hong Kong":"HK","Hungary":"HU",
  "Iceland":"IS","India":"IN","Indonesia":"ID","Iran":"IR","Iraq":"IQ",
  "Ireland":"IE","Israel":"IL","Italy":"IT","Jamaica":"JM","Japan":"JP",
  "Jordan":"JO","Kazakhstan":"KZ","Kenya":"KE","Kuwait":"KW","Laos":"LA",
  "Latvia":"LV","Lebanon":"LB","Libya":"LY","Lithuania":"LT","Luxembourg":"LU",
  "Malaysia":"MY","Malta":"MT","Mexico":"MX","Moldova":"MD","Mongolia":"MN",
  "Morocco":"MA","Myanmar":"MM","Nepal":"NP","Netherlands":"NL","New Zealand":"NZ",
  "Nigeria":"NG","North Korea":"KP","Norway":"NO","Oman":"OM","Pakistan":"PK",
  "Panama":"PA","Paraguay":"PY","Peru":"PE","Philippines":"PH","Poland":"PL",
  "Portugal":"PT","Qatar":"QA","Romania":"RO","Russia":"RU","Saudi Arabia":"SA",
  "Serbia":"RS","Singapore":"SG","Slovakia":"SK","Slovenia":"SI","South Africa":"ZA",
  "South Korea":"KR","Spain":"ES","Sri Lanka":"LK","Sweden":"SE","Switzerland":"CH",
  "Syria":"SY","Taiwan":"TW","Thailand":"TH","Tunisia":"TN","Turkey":"TR",
  "Ukraine":"UA","United Arab Emirates":"AE","United Kingdom":"GB",
  "United States":"US","Uruguay":"UY","Uzbekistan":"UZ","Venezuela":"VE",
  "Vietnam":"VN","Yemen":"YE","Zambia":"ZM","Zimbabwe":"ZW",
};

function normalize(entry) {
  if (typeof entry === "string") {
    return { name: entry, code: CODE_MAP[entry] || "" };
  }
  return { name: entry.name, code: entry.code || CODE_MAP[entry.name] || "" };
}

function flagFromCode(code) {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))
  );
}

export default function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const list = rawCountries.map(normalize);
  const filtered = list.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = list.find((c) => c.name === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(c) {
    setOpen(false);
    setSearch("");
    onChange({ target: { value: c.name } });
  }

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <button type="button" onClick={() => setOpen((o) => !o)} style={styles.trigger}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>
            {selected ? flagFromCode(selected.code) : "🌐"}
          </span>
          <span style={{ color: selected ? "#e5e7eb" : "#8b93a7", fontSize: 16 }}>
            {selected ? selected.name : "Select your country"}
          </span>
        </span>
        <span
          style={{
            color: "#8b93a7",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div style={styles.dropdown}>
          <input
            autoFocus
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.list}>
            {filtered.length === 0 && <div style={styles.noResults}>No countries found</div>}
            {filtered.map((c) => (
              <div
                key={c.name}
                onClick={() => select(c)}
                style={{
                  ...styles.option,
                  backgroundColor: c.name === value ? "rgba(108,92,231,0.15)" : "transparent",
                }}
              >
                <span style={{ fontSize: 17 }}>{flagFromCode(c.code)}</span>
                <span style={{ color: "#e5e7eb", fontSize: 15 }}>{c.name}</span>
                {c.name === value && <span style={styles.check}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { position: "relative", width: "100%", marginBottom: 16 },
  trigger: {
    width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "16px 18px", borderRadius: 14,
    border: "1px solid #2a3149", backgroundColor: "#131b2e", cursor: "pointer",
  },
  dropdown: {
    position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
    backgroundColor: "#131b2e", border: "1px solid #2a3149", borderRadius: 14,
    boxShadow: "0 12px 28px rgba(0,0,0,0.45)", zIndex: 50, overflow: "hidden",
  },
  searchInput: {
    width: "100%", boxSizing: "border-box", padding: "14px 16px", border: "none",
    borderBottom: "1px solid #2a3149", backgroundColor: "transparent",
    color: "#e5e7eb", fontSize: 15, outline: "none",
  },
  list: { maxHeight: 220, overflowY: "auto" },
  option: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer" },
  check: { marginLeft: "auto", color: "#7c6cf5", fontWeight: 700 },
  noResults: { padding: "14px 16px", color: "#8b93a7", fontSize: 14 },
};

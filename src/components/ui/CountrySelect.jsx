import { useMemo, useState } from "react";
import { countries } from "../../lib/countries";

export default function CountrySelect({
  value,
  onChange,
}) {
  const [search, setSearch] = useState("");

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      country
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  function handleSelect(e) {
    const selectedCountry = e.target.value;

    setSearch(selectedCountry);

    onChange(selectedCountry);
  }

  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "16px",
          background: "#0d1226",
          border: "1px solid #232b45",
          borderRadius: "16px",
          color: "#ffffff",
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
          marginBottom: "12px",
        }}
      />

      <select
        value={value}
        onChange={handleSelect}
        style={{
          width: "100%",
          padding: "16px",
          background: "#0d1226",
          border: "1px solid #232b45",
          borderRadius: "16px",
          color: "#ffffff",
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
        }}
      >
        <option value="">
          Select your country
        </option>

        {filteredCountries.map((country) => (
          <option
            key={country}
            value={country}
          >
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";

// No TypeScript types here
// Just keep it JavaScript
// Documentation only:
/**
 * @typedef {Object} Coin
 * @property {string} id
 * @property {string} symbol
 * @property {string} name
 * @property {string} image
 * @property {number} current_price
 * @property {number} market_cap
 * @property {number} market_cap_rank
 * @property {number} price_change_percentage_24h
 * @property {number} total_volume
 */

const fmtMoney = (n, min = 2, max = 2) =>
  n.toLocaleString(undefined, { minimumFractionDigits: min, maximumFractionDigits: max });

const fmtBig = (n) =>
  n >= 1_000_000_000
    ? `${(n / 1_000_000_000).toFixed(2)}B`
    : n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n.toLocaleString();

export default function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [sortDir, setSortDir] = useState("asc");
  const [perPage, setPerPage] = useState(50);

  const fetchCoins = async () => {
    try {
      setError(null);
      setLoading(true);
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCoins(data);
    } catch (e) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const id = setInterval(fetchCoins, 60000);
    return () => clearInterval(id);
  }, [perPage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? coins.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.symbol.toLowerCase().includes(q)
        )
      : coins;

    const sorted = [...list].sort((a, b) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") {
        cmp = va - vb;
      } else {
        cmp = String(va).localeCompare(String(vb));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [coins, query, sortBy, sortDir]);

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>💰 Coin Dashboard</h1>
      {loading ? <p>Loading…</p> : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {!loading && !error && (
        <ul>
          {filtered.map((coin) => (
            <li key={coin.id}>
              <img src={coin.image} alt={coin.symbol} width={20} />{" "}
              {coin.name} ({coin.symbol.toUpperCase()}) — $
              {fmtMoney(coin.current_price)}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
};

const fmtMoney = (n: number, min = 2, max = 2) =>
  n.toLocaleString(undefined, { minimumFractionDigits: min, maximumFractionDigits: max });

const fmtBig = (n: number) =>
  n >= 1_000_000_000
    ? `${(n / 1_000_000_000).toFixed(2)}B`
    : n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n.toLocaleString();

export default function Page() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<keyof Coin>("market_cap_rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [perPage, setPerPage] = useState(50);

  const fetchCoins = async () => {
    try {
      setError(null);
      setLoading(true);
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Coin[];
      setCoins(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const id = setInterval(fetchCoins, 60_000); // auto-refresh every 60s
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const headerCell = (label: string, key: keyof Coin, width?: number) => (
    <th
      key={String(key)}
      style={{
        textAlign: key === "name" ? "left" : "right",
        padding: "12px",
        cursor: "pointer",
        width,
        whiteSpace: "nowrap",
      }}
      onClick={() => {
        if (sortBy === key) {
          setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
          setSortBy(key);
          setSortDir(key === "market_cap_rank" ? "asc" : "desc");
        }
      }}
      title="Click to sort"
    >
      {label}{" "}
      {sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : ""}
    </th>
  );

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px",
        fontFamily:
          "-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>💰 Coin Dashboard</h1>
          <small style={{ color: "#666" }}>
            Live market data (USD) • Auto-refreshes every 60s
          </small>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coin or symbol (e.g., btc)…"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              minWidth: 260,
            }}
          />
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
            title="Rows"
          >
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
          <button
            onClick={fetchCoins}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #222",
              background: "#111",
              color: "white",
              cursor: "pointer",
            }}
            title="Refresh now"
          >
            Refresh
          </button>
        </div>
      </header>

      <section
        style={{
          background: "white",
          border: "1px solid #eee",
          borderRadius: 14,
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>
          {loading ? (
            <span>Loading market data…</span>
          ) : error ? (
            <span style={{ color: "crimson" }}>
              Failed to load: {error}. Try Refresh.
            </span>
          ) : (
            <span>
              Showing <b>{filtered.length}</b> coins
              {query ? (
                <>
                  {" "}
                  filtered by <i>"{query}"</i>
                </>
              ) : null}
              .
            </span>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
              <tr>
                {headerCell("#", "market_cap_rank", 70)}
                {headerCell("Coin", "name")}
                {headerCell("Price", "current_price", 140)}
                {headerCell("24h %", "price_change_percentage_24h", 120)}
                {headerCell("Market Cap", "market_cap", 160)}
                {headerCell("Volume (24h)", "total_volume", 160)}
              </tr>
            </thead>
            <tbody>
              {!loading &&
                filtered.map((c) => {
                  const change = c.price_change_percentage_24h ?? 0;
                  const up = change >= 0;
                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f3f3f3" }}>
                      <td style={{ textAlign: "right", padding: "12px" }}>
                        {c.market_cap_rank ?? "-"}
                      </td>
                      <td style={{ textAlign: "left", padding: "12px", display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={c.image} alt={c.symbol} width={22} height={22} style={{ borderRadius: 999 }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ color: "#666", fontSize: 12 }}>{c.symbol.toUpperCase()}</div>
                        </div>
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", fontVariantNumeric: "tabular-nums" }}>
                        ${fmtMoney(c.current_price)}
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", fontVariantNumeric: "tabular-nums", color: up ? "seagreen" : "crimson" }}>
                        {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", fontVariantNumeric: "tabular-nums" }}>
                        ${fmtBig(c.market_cap)}
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", fontVariantNumeric: "tabular-nums" }}>
                        ${fmtBig(c.total_volume)}
                      </td>
                    </tr>
                  );
                })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#666" }}>
                    No coins match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer style={{ textAlign: "center", color: "#888", fontSize: 12, marginTop: 16 }}>
        Data: CoinGecko public API • For demo use only
      </footer>
    </main>
  );
}

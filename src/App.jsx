"use client";
import { useState, useEffect } from "react";
import "./index.css"; // <-- make sure it's imported

export default function Home() {
  const [coinCount, setCoinCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoins = async () => {
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      const data = await res.json();
      setCoinCount(data.coinCount);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCoins = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/data", { method: "DELETE" });
      setCoinCount(0);
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>💰 Coin Counter</h1>

      {isLoading ? (
        <p className="counter-value">...</p>
      ) : (
        <p className="counter-value">{coinCount}</p>
      )}

      <button onClick={resetCoins} disabled={isLoading}>
        {isLoading ? "Processing..." : "Reset"}
      </button>
    </div>
  );
}
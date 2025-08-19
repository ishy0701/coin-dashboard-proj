"use client";
import { useState, useEffect } from "react";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">💰 Coin Counter</h1>
      
      {isLoading ? (
        <div className="text-6xl font-bold text-blue-500 animate-pulse">...</div>
      ) : (
        <h2 className="text-6xl font-bold text-blue-500">{coinCount}</h2>
      )}
      
      <button
        onClick={resetCoins}
        disabled={isLoading}
        className={`mt-6 px-6 py-2 rounded-xl ${isLoading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isLoading ? "Processing..." : "Reset"}
      </button>
    </div>
  );
}
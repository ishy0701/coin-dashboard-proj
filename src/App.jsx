import { useEffect, useState } from "react";

function App() {
  const [total, setTotal] = useState(0);

  const fetchTotal = async () => {
    const res = await fetch("/api/coins"); // Calls Vercel API
    const data = await res.json();
    setTotal(data.total);
  };

  useEffect(() => {
    fetchTotal();
    const interval = setInterval(fetchTotal, 2000); // refresh every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">💰 Coin Counter</h1>
      <p className="text-2xl mt-4">{total}</p>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={async () => {
          await fetch("/api/coins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: 1 })
          });
          fetchTotal();
        }}
      >
        Add Coin (Test)
      </button>
    </div>
  );
}


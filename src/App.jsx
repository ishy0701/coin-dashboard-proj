
// App.jsx
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  // Fetch latest coin total from backend
  useEffect(() => {
    fetch("https://coin-dashboard-proj.vercel.app/api/data")
      .then((res) => res.json())
      .then((data) => {
        setCount(data.total);
      })
      .catch((err) => console.error("Error fetching data:", err));

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetch("https://coin-dashboard-proj.vercel.app/api/data")
        .then((res) => res.json())
        .then((data) => setCount(data.total));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Reset function
  const handleReset = async () => {
    await fetch("https://coin-dashboard-proj.vercel.app/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coinCount: -count }), // subtract current total
    });

    setCount(0);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#1a1a1a",
        color: "white",
      }}
    >
      <h1>💰 Coin Counter</h1>
      <h2 style={{ fontSize: "3rem", margin: "20px" }}>{count}</h2>
      <button
        style={{
          background: "black",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          border: "none",
        }}
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
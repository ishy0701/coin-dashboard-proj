import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch latest coin total from backend
  const fetchData = () => {
    fetch("https://coin-dashboard-proj.vercel.app/api/data")
      .then((res) => res.json())
      .then((data) => {
        setCount(data.total);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Insert coin
  const handleInsert = async (value) => {
    await fetch("https://coin-dashboard-proj.vercel.app/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coinCount: value }),
    });
    setCount((prev) => prev + value);
    setHistory((prev) => [
      `Inserted ${value} coin(s) at ${new Date().toLocaleTimeString()}`,
      ...prev,
    ]);
  };

  // Reset function
  const handleReset = async () => {
    await fetch("https://coin-dashboard-proj.vercel.app/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coinCount: -count }),
    });

    setHistory((prev) => [
      `Reset at ${new Date().toLocaleTimeString()}`,
      ...prev,
    ]);
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
        backgroundColor: "#121212",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>💰 Coin Counter</h1>
      <h2 style={{ fontSize: "4rem", margin: "20px" }}>{count}</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => handleInsert(1)} style={btnStyle}>
          +1
        </button>
        <button onClick={() => handleInsert(5)} style={btnStyle}>
          +5
        </button>
        <button onClick={() => handleInsert(10)} style={btnStyle}>
          +10
        </button>
        <button onClick={handleReset} style={{ ...btnStyle, background: "red" }}>
          Reset
        </button>
      </div>

      {lastUpdated && (
        <p style={{ fontSize: "0.9rem", color: "gray" }}>
          Last updated: {lastUpdated}
        </p>
      )}

      <div
        style={{
          marginTop: "20px",
          width: "300px",
          background: "#1e1e1e",
          padding: "15px",
          borderRadius: "10px",
          textAlign: "left",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>📜 History</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.9rem" }}>
          {history.slice(0, 5).map((item, idx) => (
            <li key={idx} style={{ marginBottom: "5px" }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "#333",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  border: "none",
  fontSize: "1rem",
};

export default App;

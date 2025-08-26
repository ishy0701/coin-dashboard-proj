let total = 0;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { value } = req.body || {};
    total += Number(value) || 0;
    return res.status(200).json({ message: "Coin added", total });
  }

  if (req.method === "GET") {
    return res.status(200).json({ total });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
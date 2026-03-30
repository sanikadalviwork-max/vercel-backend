export default function handler(req, res) {
  res.status(200).json([
    { name: "Lipstick", price: 499 },
    { name: "Foundation", price: 999 }
  ]);
}
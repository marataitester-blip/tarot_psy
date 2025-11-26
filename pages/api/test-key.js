export default function handler(req, res) {
  res.status(200).json({ key: process.env.NEXT_PUBLIC_API_KEY || 'Ключ не найден' });
}
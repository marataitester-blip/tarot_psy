
export default function handler(req, res) {
  // Allow simple debugging from browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const key = process.env.NEXT_PUBLIC_API_KEY;
  
  res.status(200).json({ 
    status: 'ok',
    keyExists: !!key,
    keyLength: key ? key.length : 0,
    prefix: key ? key.substring(0, 4) + '****' : 'NONE',
    env: process.env.NODE_ENV
  });
}

export default async function handler(req, res) {
  const { type, id } = req.query;
  // Vercel Settings에서 입력한 변수명과 일치해야 합니다.
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  const TABLE = type === 'records' ? 'records' : 'themes';
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${url}?select=*&order=created_at.desc`, { headers });
      return res.status(200).json(await response.json());
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const response = await fetch(url, {
        method: 'POST',
        headers: { ...headers, "Prefer": "resolution=merge-duplicates" },
        body: JSON.stringify(body)
      });
      return res.status(200).json(await response.json());
    }

    if (req.method === 'DELETE') {
      await fetch(`${url}?id=eq.${id}`, { method: 'DELETE', headers });
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

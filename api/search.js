// api/search.js
export default async function handler(req, res) {
  const { query } = req.query;
  const API_KEY = process.env.tmdb_key; // Vercel 설정에서 가져올 키값

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}

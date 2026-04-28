import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    try {
        const db = await kv.get('fan_db') || {};
        const themes = await kv.get('fan_themes') || [];
        return res.status(200).json({ db, themes });
    } catch (e) { return res.status(500).json({ error: e.message }); }
}

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { type, payload } = JSON.parse(req.body);

    try {
        if (type === 'SHOUT') {
            const db = await kv.get('fan_db') || {};
            const { actor, work, tags } = payload;
            if(!db[actor]) db[actor] = {};
            if(!db[actor][work.title]) db[actor][work.title] = { count: 0, poster: work.poster, tags: [] };
            db[actor][work.title].count++;
            db[actor][work.title].tags = [...new Set([...db[actor][work.title].tags, ...tags])];
            await kv.set('fan_db', db);
        } else if (type === 'THEME_SAVE') {
            const themes = await kv.get('fan_themes') || [];
            const { themeData } = payload;
            const idx = themes.findIndex(t => t.id == themeData.id);
            if(idx > -1) themes[idx] = themeData;
            else themes.push(themeData);
            await kv.set('fan_themes', themes);
        }
        return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
}

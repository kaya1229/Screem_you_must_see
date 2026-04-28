import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Vercel 환경변수에서 자동으로 가져옴
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  const { type } = req.query

  // 1. 데이터 불러오기 (GET)
  if (req.method === 'GET') {
    const table = type === 'records' ? 'fan_records' : 'fan_themes'
    const { data } = await supabase.from(table).select('*').order('created_at', { ascending: type === 'records' })
    return res.status(200).json(data)
  }

  // 2. 데이터 저장하기 (POST)
  if (req.method === 'POST') {
    const body = JSON.parse(req.body)
    const table = type === 'records' ? 'fan_records' : 'fan_themes'
    
    let result;
    if (type === 'themes') {
      result = await supabase.from(table).upsert(body)
    } else {
      result = await supabase.from(table).insert([body])
    }
    
    return res.status(200).json({ success: !result.error })
  }
}

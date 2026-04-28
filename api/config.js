// 예시: 데이터를 불러오는 중계 API
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 서버 환경 변수에서 키를 읽어옴 (브라우저엔 노출 안 됨)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('fan_records').select('*')
    return res.status(200).json(data)
  }
  
  if (req.method === 'POST') {
    const body = JSON.parse(req.body)
    const { error } = await supabase.from('fan_records').insert([body])
    return res.status(200).json({ success: !error })
  }
}

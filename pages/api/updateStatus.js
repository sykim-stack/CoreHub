// /pages/api/updateStatus.js

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  try {
    const { customer_id, status, memo, context } = req.body

    if (!customer_id || !status) {
      return res.status(400).json({ ok: false, message: 'missing params' })
    }

    // ✅ AI 분석 (Gemini)
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
고객 상태 분석:

상태: ${status}
메모: ${memo || ''}

반환 형식(JSON):
{
  "sentiment": "positive | neutral | negative",
  "probability": 0~100 숫자,
  "risk": "low | medium | high"
}
`
            }]
          }]
        })
      }
    )

    const aiData = await aiRes.json()

    let parsed = {
      sentiment: 'neutral',
      probability: 50,
      risk: 'medium'
    }

    try {
      const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
      parsed = JSON.parse(text)
    } catch (e) {}

    // ✅ RPC 호출 (모든 판단 DB로 이동)
    const { error } = await supabase.rpc('update_customer_status', {
      p_customer_id: customer_id,
      p_status: status,
      p_memo: memo || null,
      p_ai_sentiment: parsed.sentiment,
      p_ai_probability: parsed.probability,
      p_ai_risk: parsed.risk
    })

    if (error) throw error

    return res.status(200).json({
      ok: true,
      ai: parsed
    })

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message
    })
  }
}
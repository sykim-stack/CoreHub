// CHANGE START

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  try {

    // 오늘 할 일
    const { data: tasks } = await supabase
      .from('customers')
      .select('*')
      .lte('next_action_date', new Date().toISOString())
      .order('next_action_date', { ascending: true })
      .limit(10)

    // 계약 가능 높은 고객
    const { data: hot } = await supabase
      .from('customers')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)

    // 위험 고객
    const { data: risk } = await supabase
      .from('customers')
      .select('*')
      .eq('ai_risk', 'high')
      .limit(10)

    return res.status(200).json({
      tasks,
      hot,
      risk
    })

  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

// CHANGE END
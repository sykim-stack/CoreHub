// CHANGE START

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [hot, setHot] = useState([])
  const [risk, setRisk] = useState([])

  useEffect(() => {
    loadData()
    subscribeRealtime()
  }, [])

  async function loadData() {
    const res = await fetch('/api/dashboard')
    const data = await res.json()
    setTasks(data.tasks || [])
    setHot(data.hot || [])
    setRisk(data.risk || [])
  }
// CHANGE START

function subscribeRealtime() {
    import('@supabase/supabase-js').then(({ createClient }) => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
  
      const channel = supabase
        .channel('customers-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customers' },
          (payload) => {
            console.log('🔥 realtime event:', payload) // 확인용
            loadData()
          }
        )
        .subscribe((status) => {
          console.log('📡 realtime status:', status) // 연결 상태 확인
        })
    })
  }
  
  // CHANGE END
  // ✅ 상태 변경
  async function updateStatus(id, status) {
    await fetch('/api/updateStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: id, status })
    })
  }

  // ✅ 실시간 반영 (Supabase Realtime)
  function subscribeRealtime() {
    import('@supabase/supabase-js').then(({ createClient }) => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      supabase
        .channel('customers-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customers' },
          () => loadData()
        )
        .subscribe()
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📊 CoreHub Dashboard</h1>

      <Section title="🔥 오늘 해야 할 일">
        {tasks.map((c) => (
          <Card key={c.id} data={c} onUpdate={updateStatus} />
        ))}
      </Section>

      <Section title="🚀 계약 확률 높은 고객">
        {hot.map((c) => (
          <Card key={c.id} data={c} highlight onUpdate={updateStatus} />
        ))}
      </Section>

      <Section title="⚠️ 위험 고객">
        {risk.map((c) => (
          <Card key={c.id} data={c} danger onUpdate={updateStatus} />
        ))}
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl mb-3">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </div>
  )
}

function Card({ data, highlight, danger, onUpdate }) {
  return (
    <div className={`p-4 rounded-xl shadow 
      ${highlight ? 'bg-green-700' : ''} 
      ${danger ? 'bg-red-700' : 'bg-gray-800'}
    `}>
      <div className="flex justify-between">
        <div>
          <div className="font-bold">{data.name || '고객'}</div>
          <div className="text-sm text-gray-300">{data.status}</div>
        </div>

        <div className="text-right">
          <div>점수: {data.score}</div>
          <div>{data.stage}</div>
        </div>
      </div>

      <div className="mt-2 text-sm">👉 {data.next_action}</div>
      <div className="text-xs text-gray-400">⏰ {data.next_action_date}</div>

      {/* ✅ 액션 버튼 */}
      <div className="mt-3 flex gap-2 text-sm">
        <button 
          onClick={() => onUpdate(data.id, 'contacted')}
          className="bg-blue-600 px-2 py-1 rounded"
        >
          연락
        </button>

        <button 
          onClick={() => onUpdate(data.id, 'negotiation')}
          className="bg-yellow-600 px-2 py-1 rounded"
        >
          협상
        </button>

        <button 
          onClick={() => onUpdate(data.id, 'contract')}
          className="bg-green-600 px-2 py-1 rounded"
        >
          계약
        </button>
      </div>

      {data.ai_risk && (
        <div className="mt-1 text-xs">
          ⚠️ 위험도: {data.ai_risk}
        </div>
      )}
    </div>
  )
}

// CHANGE END
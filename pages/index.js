// CHANGE START

import { useEffect, useState } from 'react'

export default function Home() {
  const [customers, setCustomers] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const res = await fetch('/api/dashboard')
    const data = await res.json()
    setCustomers(data.hot || [])
  }

  async function updateStatus(id, status) {
    await fetch('/api/updateStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: id, status })
    })
    load()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">

      {/* 왼쪽 리스트 */}
      <div className="w-1/3 border-r border-gray-700 p-4">
        <h2 className="text-xl mb-4">👥 고객 리스트</h2>

        {customers.map(c => (
          <div 
            key={c.id}
            onClick={() => setSelected(c)}
            className="p-3 mb-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
          >
            <div className="font-bold">{c.name || '고객'}</div>
            <div className="text-sm text-gray-400">{c.status}</div>
          </div>
        ))}
      </div>

      {/* 오른쪽 상세 */}
      <div className="flex-1 p-6">
        {!selected ? (
          <div className="text-gray-400">고객 선택</div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-2xl mb-4">📋 고객 상세</h2>

            <div className="mb-2">이름: {selected.name}</div>
            <div className="mb-2">상태: {selected.status}</div>
            <div className="mb-2">점수: {selected.score}</div>
            <div className="mb-2">단계: {selected.stage}</div>

            <div className="mt-4 p-3 bg-gray-700 rounded">
              👉 {selected.next_action}
            </div>

            <div className="text-sm text-gray-400 mt-1">
              ⏰ {selected.next_action_date}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => updateStatus(selected.id, 'contacted')} className="bg-blue-600 px-3 py-1 rounded">
                연락
              </button>

              <button onClick={() => updateStatus(selected.id, 'negotiation')} className="bg-yellow-600 px-3 py-1 rounded">
                협상
              </button>

              <button onClick={() => updateStatus(selected.id, 'contract')} className="bg-green-600 px-3 py-1 rounded">
                계약
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

// CHANGE END
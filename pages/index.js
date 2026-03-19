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

  function getStatusColor(status) {
    switch (status) {
      case 'lead': return 'bg-gray-500'
      case 'contacted': return 'bg-blue-500'
      case 'negotiation': return 'bg-yellow-500'
      case 'contract': return 'bg-green-500'
      default: return 'bg-gray-400'
    }
  }

  function isToday(dateStr) {
    if (!dateStr) return false
    const today = new Date().toISOString().slice(0, 10)
    return dateStr === today
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">

      {/* LEFT: 고객 리스트 */}
      <div className="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-xl mb-4">👥 고객 리스트</h2>

        {customers.map(c => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            className="p-4 mb-3 bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-700 transition"
          >
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">{c.name || '고객'}</div>

              {isToday(c.next_action_date) && (
                <span className="text-xs bg-red-500 px-2 py-1 rounded">
                  TODAY
                </span>
              )}
            </div>

            <div className={`inline-block px-2 py-1 text-xs rounded mt-2 ${getStatusColor(c.status)}`}>
              {c.status}
            </div>

            <div className="text-xs text-gray-400 mt-2">
              점수: {c.score} / 단계: {c.stage}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: 상세 */}
      <div className="flex-1 p-6">
        {!selected ? (
          <div className="text-gray-400 text-lg">👈 고객을 선택하세요</div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

            <h2 className="text-2xl mb-6">📋 고객 상세</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>이름: {selected.name}</div>
              <div>상태: {selected.status}</div>
              <div>점수: {selected.score}</div>
              <div>단계: {selected.stage}</div>
            </div>

            {/* 다음 액션 */}
            <div className={`p-4 rounded-xl mb-4 ${isToday(selected.next_action_date) ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}>
              <div className="text-sm text-gray-300">다음 액션</div>
              <div className="text-lg font-bold">
                {selected.next_action || '없음'}
              </div>
              <div className="text-xs mt-1">
                {selected.next_action_date || ''}
              </div>
            </div>

            {/* 상태 변경 버튼 */}
            <div className="flex gap-3 mt-4">
              <button onClick={() => updateStatus(selected.id, 'contacted')} className="bg-blue-600 px-4 py-2 rounded-lg hover:opacity-80">
                📞 연락
              </button>

              <button onClick={() => updateStatus(selected.id, 'negotiation')} className="bg-yellow-500 px-4 py-2 rounded-lg hover:opacity-80">
                🤝 협상
              </button>

              <button onClick={() => updateStatus(selected.id, 'contract')} className="bg-green-600 px-4 py-2 rounded-lg hover:opacity-80">
                ✅ 계약
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  )
}

// CHANGE END
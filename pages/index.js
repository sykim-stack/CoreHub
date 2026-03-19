import { useState, useEffect } from 'react';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // 브라우저에서만 실행되도록 보장
  // 기존 fetch 부분을 아래처럼 '조건문'으로 감싸주세요.
useEffect(() => {
    const fetchData = async () => {
      try {
        // 빌드 시점이 아니라 실제 브라우저에서만 실행되도록 보장
        if (typeof window !== 'undefined') {
          const res = await fetch('/api/customers');
          if (res.ok) {
            const data = await res.json();
            setCustomers(Array.isArray(data) ? data : []);
          }
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setCustomers([]); // 실패해도 빈 배열로 설정해 빌드 오류 방지
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        setSelected(null);
      }
    } catch (error) {
      alert("상태 업데이트 실패");
    }
  };

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Core Hub - 고객 관리</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">고객 리스트</h2>
          {loading ? (
            <p className="text-gray-500">로딩 중...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-b p-3 text-left">이름</th>
                    <th className="border-b p-3">상태</th>
                    <th className="border-b p-3 text-right">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="border-b p-3">{c.name}</td>
                      <td className="border-b p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.status === 'lead' ? 'bg-yellow-100 text-yellow-800' : 
                          c.status === '상담중' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="border-b p-3 text-right">
                        <button 
                          onClick={() => setSelected(c)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-400">등록된 고객이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{selected.name} 상세 정보</h2>
            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded border">
              <p className="text-gray-600"><strong className="text-gray-800 w-24 inline-block">전화번호:</strong> {selected.phone}</p>
              <p className="text-gray-600"><strong className="text-gray-800 w-24 inline-block">언어/국적:</strong> {selected.language} / {selected.nationality}</p>
              <p className="text-gray-600"><strong className="text-gray-800 w-24 inline-block">현재 상태:</strong> {selected.status}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateStatus(selected.id, '상담중')}
                className="bg-purple-500 text-white py-2 rounded font-semibold hover:bg-purple-600"
              >
                상담중 변경
              </button>
              <button
                onClick={() => updateStatus(selected.id, '계약완료')}
                className="bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600"
              >
                계약완료
              </button>
              <button
                onClick={() => setSelected(null)}
                className="col-span-2 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 mt-2"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// FULL SOURCE

export default async function handler(req, res) {
    const { message } = req.body;
  
    // 카톡은 직접 메시지 자동 입력 불가 → 복사용 처리
    const encoded = encodeURIComponent(message);
  
    // 공유 URL (임시)
    const url = `https://share.kakao.com/?text=${encoded}`;
  
    res.status(200).json({ url, message });
  }
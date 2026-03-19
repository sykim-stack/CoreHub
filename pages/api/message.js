// CHANGE START

export default async function handler(req, res) {
  const { name, status } = req.body;

  let text = '';

  if (status === '상담중') {
    text = `Xin chào ${name}, tôi là tư vấn viên bảo hiểm tại Hàn Quốc. 
Hôm trước chúng ta đã trao đổi, bạn đã suy nghĩ thêm chưa?
Nếu cần tư vấn thêm, tôi luôn sẵn sàng hỗ trợ bạn 😊`;
  }

  if (status === '미응답') {
    text = `Xin chào ${name}, tôi liên hệ lại để hỗ trợ bạn về bảo hiểm. 
Bạn có thể trả lời khi bạn tiện nhé!`;
  }

  if (status === '계약유도') {
    text = `Xin chào ${name}, hiện tại có chương trình ưu đãi phù hợp với bạn. 
Nếu bạn đăng ký sớm, bạn sẽ được nhiều quyền lợi hơn 👍`;
  }

  res.status(200).json({ text });
}

// CHANGE END
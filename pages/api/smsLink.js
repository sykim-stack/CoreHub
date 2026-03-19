// FULL SOURCE

export default async function handler(req, res) {
    const { phone, message } = req.body;
  
    const encoded = encodeURIComponent(message);
  
    const url = `sms:${phone}?body=${encoded}`;
  
    res.status(200).json({ url });
  }
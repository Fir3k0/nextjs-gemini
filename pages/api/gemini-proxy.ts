// pages/api/gemini-proxy.js

export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 從 Vercel 環境變數中安全地獲取 API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'API Key not configured' });
  }

  // 從客戶端請求體中獲取需要發送給 Gemini 的數據 (例如 prompt)
  // 注意：你需要根據 Gemini API 的實際要求來構建這個 body
  // 例如，對於 generateContent:
  const requestBody = req.body; // 假設客戶端發送了 { "contents": [...] }

  // Gemini API 的端點 (請根據你使用的模型和方法調整)
  // 例如 gemini-pro 的 generateContent
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // 將客戶端傳來的數據轉發
    });

    if (!response.ok) {
      // 如果 Gemini API 返回錯誤，將錯誤信息傳遞回去
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json(errorData);
    }

    // 將 Gemini API 的成功響應返回給客戶端
    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ message: 'Error forwarding request to Gemini API' });
  }
}

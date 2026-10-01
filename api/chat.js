export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // FIX: Vercel automatically parses the body. 
    // We use req.body directly instead of JSON.parse(req.body)
    const body = req.body; 
    const message = body.message;

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are the Shadow. Cold, commanding, and efficient." },
          { role: "user", content: message }
        ],
        temperature: 0.85,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: 'Groq API Error: ' + data.error.message });
    }

    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

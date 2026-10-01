export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = JSON.parse(req.body);
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
    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

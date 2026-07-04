module.exports = async function handler(req, res) {
  try {
    // 1. Bulletproof request body extraction
    let message = "Hi"; // Safe default fallback
    
    if (req.body) {
      if (typeof req.body === 'string') {
        try {
          const parsed = JSON.parse(req.body);
          message = parsed.message || message;
        } catch (e) {
          message = req.body; // use raw string if parsing fails
        }
      } else if (typeof req.body === 'object') {
        message = req.body.message || message;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    // 2. Fetch from Google Gemini
    const googleResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        }),
      }
    );

    const data = await googleResponse.json();
    
    // 3. Extract response text safely
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.";

    // 4. Return to frontend
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Error in chat backend:", error);
    return res.status(500).json({ error: 'Internal Server Error processing message.' });
  }
};
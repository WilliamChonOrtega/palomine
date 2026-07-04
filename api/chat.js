module.exports = async function handler(req, res) {
  // 1. Only allow POST requests (like sending a message)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Safeguard check to ensure your key is loaded
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    // 3. Talk to Google Gemini securely behind the scenes
    const googleResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        }),
      }
    );

        const data = await googleResponse.json();
    
    // Safely extract the text from Gemini's nested response
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.";
    
    // Send it back to your frontend interface
    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error("Error in chat backend:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = async function handler(req, res) {
  try {
    // 1. Safely handle the request parsing if req.body isn't pre-parsed
    let message = "";
    if (req.body && req.body.message) {
      message = req.body.message;
    } else if (typeof req.on === 'function') {
      // Fallback to reading the buffer stream if req.body is undefined
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = JSON.parse(Buffer.concat(buffers).toString());
      message = data.message;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Safeguard check to ensure your key is loaded
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    // 3. Talk to Google Gemini securely behind the scenes
    const googleResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message || "Hi" }] }]
        }),
      }
    );

    const data = await googleResponse.json();
    
    // Safely extract the text from Gemini's nested response structure
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.";

    // 4. Send it back to your frontend in the JSON format it expects
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Error in chat backend:", error);
    // Explicitly return a 500 error if the internal code trips up
    return res.status(500).json({ error: 'Internal Server Error processing message.' });
  }
};
module.exports = async function handler(req, res) {
  try {
    let rawBody = "";

    // 1. If req.body is already parsed by the server environment, use it
    if (req.body) {
      if (typeof req.body === 'object') {
        rawBody = JSON.stringify(req.body);
      } else {
        rawBody = req.body;
      }
    } else {
      // 2. If req.body is completely undefined, read the raw data stream manually
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      rawBody = Buffer.concat(buffers).toString();
    }

    // 3. Extract the message out of whatever data format came in
    let message = "Hi"; // Default fallback
    if (rawBody) {
      try {
        const parsed = JSON.parse(rawBody);
        message = parsed.message || message;
      } catch (e) {
        // If it isn't valid JSON, treat the entire raw input as the string message
        message = rawBody || message;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    // 4. Talk to Google Gemini securely
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
    
    // 5. Safely extract the reply text
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.";

    // 6. Return the expected payload to the frontend
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Error in chat backend:", error);
    return res.status(500).json({ error: 'Internal Server Error processing message.' });
  }
};
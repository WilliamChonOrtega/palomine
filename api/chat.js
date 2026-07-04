module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY on server." });
    }

    const message =
      req.body?.message ||
      req.body?.prompt ||
      req.body?.text ||
      req.body?.contents?.[0]?.parts?.[0]?.text;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "No valid message received from frontend.",
        receivedBody: req.body,
      });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: "Gemini API error",
        details: data,
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "The AI service responded, but no text was returned.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat backend error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
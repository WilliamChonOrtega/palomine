module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY on server." });
    }

    const geminiPayload = req.body;

    if (!geminiPayload || !geminiPayload.contents) {
      return res.status(400).json({
        error: "Invalid request body. Expected Gemini contents payload.",
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
        body: JSON.stringify(geminiPayload),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: "Gemini API error",
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Chat backend error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
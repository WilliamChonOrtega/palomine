export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // 1. Parse the incoming request body
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Safeguard check to ensure your key is loaded
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is missing on the server.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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
          contents: [{ parts: [{ text: message }] }]
        }),
      }
    );

    const data = await googleResponse.json();
    
    // Safely extract the text from Gemini's nested response
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.";

    // 4. Send it back to your frontend interface
    return new Response(
      JSON.stringify({ reply: replyText }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in chat backend:", error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
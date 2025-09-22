// Importa el SDK de Gemini o la librería de OpenAI
// Aquí pondrías la lógica de la llamada a la API

export default async function handler(request, response) {
  // 1. Oculta tu clave de API usando una variable de entorno de Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. Lee los datos enviados desde tu frontend (el texto original y el tono)
  const { text, tone } = request.body;

  if (!text) {
    return response.status(400).json({ error: "Falta el texto a humanizar" });
  }

  try {
    // 3. Usa la clave de API para hacer la llamada a la IA
    // Ejemplo simplificado:
    const humanizedText = await callGeminiAPI(text, tone, apiKey);

    // 4. Envía la respuesta al frontend
    response.status(200).json({ humanizedText });
  } catch (error) {
    console.error("Error en la función de humanización:", error);
    response.status(500).json({ error: "Error al humanizar el texto" });
  }
}

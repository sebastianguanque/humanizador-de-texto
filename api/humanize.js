import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  // Asegúrate de que el método sea POST
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method Not Allowed" });
  }

  // Lee la clave de API desde las variables de entorno de Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: "API key not configured." });
  }

  // Obtiene el texto y el tono del cuerpo de la petición
  const { text, tone } = request.body;

  if (!text) {
    return response.status(400).json({ error: "Falta el texto a humanizar" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Crea el prompt detallado para la IA
    const prompt = `Actúa como un humanizador de texto profesional. Transforma el siguiente texto para que suene más humano, natural y empático, eliminando el tono robótico o genérico. El tono deseado es: ${tone}. Mantén el significado original.

    Texto para humanizar:
    """
    ${text}
    """
    `;

    const result = await model.generateContent(prompt);
    const apiResponse = await result.response;
    const humanizedText = apiResponse.text();

    // Envía el texto humanizado al frontend
    response.status(200).json({ humanizedText });
  } catch (error) {
    console.error("Error en la función de humanización:", error);
    response
      .status(500)
      .json({
        error:
          "Error al procesar el texto con la IA. Por favor, revisa la API key o los logs.",
      });
  }
}

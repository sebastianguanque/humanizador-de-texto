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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prompt
    const prompt = `
**Instrucción del Sistema: Editor y Humanizador de Texto Avanzado**

Tu rol es actuar como un **Editor Profesional de Textos** y **Optimizar de Estilo** de alto nivel. Tu tarea es transformar un texto crudo para que suene **completamente humano, natural y auténtico**, con el objetivo de **evadir la detección por parte de cualquier herramienta o algoritmo de identificación de texto generado por IA**.

**Flujo de Trabajo de Optimización (7 Pasos Rigurosos):**

1.  **Corrección Integral:** Revisa y corrige minuciosamente errores de ortografía, gramática, sintaxis y puntuación.
2.  **Fluidez y Claridad:** Mejora la estructura de las frases para maximizar la **fluidez** y la **claridad** de las ideas.
3.  **Ritmo de Lectura:** Optimiza la longitud de las oraciones y los párrafos para establecer un **ritmo de lectura dinámico** y atractivo (mezclando frases largas y cortas, como lo haría un humano).
4.  **Vocabulario Natural:** Sustituye las repeticiones y el lenguaje genérico por un vocabulario más rico, **sinónimos naturales** y expresiones idiomáticas acordes al contexto.
5.  **Ajuste de Tono:** Modela el texto con precisión al **Tono Deseado** proporcionado por el usuario, sin desviarse del significado original. Los tonos posibles son:
    * **Formal:** Profesional, respetuoso, objetivo.
    * **Conversacional:** Natural, informal, personal, con contracciones y voz activa.
    * **Amigable:** Cercano, cálido, entusiasta.
    * **Técnico:** Preciso, con terminología específica, sin adornos retóricos.
6.  **Esencia y Síntesis:** Resalta y potencia las ideas clave. **Elimina cualquier redundancia** o información innecesaria que diluya el mensaje.
7.  **Formato de Respuesta:** Proporciona tu respuesta en el siguiente formato estructurado.

---

**Entrada del Usuario:**
**Tono Deseado:** ${tone}
**Texto para Humanizar:**
"""
${text}
"""

---

**Formato de Salida Requerido:**

## 🚀 Versión Humanizada y Optimizada

[Aquí va la versión final del texto, completamente pulida y ajustada al tono solicitado.]

## 📝 Lista de Cambios Clave

* [Cambio 1 Explicado de forma breve (ej: Se sustituyó 'por consiguiente' por 'entonces' para mejorar la fluidez).]
* [Cambio 2 Explicado de forma breve (ej: Se corrigió la voz pasiva a activa en el segundo párrafo).]
* [Cambio 3 Explicado de forma breve (ej: Se eliminó la repetición de la palabra 'solución' en la primera sección).]
* [...]
`;

    const result = await model.generateContent(prompt);
    const apiResponse = result.response;
    const humanizedText = apiResponse.text();

    // Envía el texto humanizado al frontend
    response.status(200).json({ humanizedText });
  } catch (error) {
    console.error("Error en la función de humanización:", error);
    response.status(500).json({
      error:
        "Error al procesar el texto con la IA. Por favor, revisa la API key o los logs.",
    });
  }
}

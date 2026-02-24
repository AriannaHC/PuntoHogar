import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateLogoSvg() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Genera un código SVG para un logo de una inmobiliaria llamada 'Punto Hogar'. El logo debe ser ÚNICAMENTE un icono minimalista (sin texto dentro del SVG), que combine una casa y un punto de ubicación. Colores: Azul marino (#1a365d) y Naranja vibrante (#c05621). Devuelve SOLO el código SVG, sin markdown, sin explicaciones.",
    config: {
      systemInstruction: "Eres un diseñador gráfico experto en logos minimalistas. Solo devuelves código SVG puro del ICONO, sin incluir el nombre de la empresa dentro del SVG. Asegúrate de que el SVG tenga un viewBox adecuado y sea escalable.",
    }
  });
  return response.text;
}

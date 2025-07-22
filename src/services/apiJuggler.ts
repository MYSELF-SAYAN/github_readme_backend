// src/utils/geminiJuggler.ts
import { GoogleGenAI } from "@google/genai";

const API_KEYS = [process.env.GOOGLE_GENAI_API_KEY!, process.env.GOOGLE_GEMINI_API_KEY_1!];

let currentKeyIndex = 0;

export async function generateContextWithJuggler(
  prompt: string
): Promise<string> {
  let lastError = null;

  for (let i = 0; i < API_KEYS.length; i++) {
    const currentKey = API_KEYS[currentKeyIndex];
    const ai = new GoogleGenAI({
      apiKey: currentKey,
    });

    try {
    //   const model = ai.models.getGenerativeModel({ model: "gemini-2.5-flash" });
    //   const result = await model.generateContent(prompt);
      const context = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return context.text ?? "";
    } catch (err: any) {
      const errorMsg = err?.message || "Unknown error";
      console.warn(`Key ${currentKeyIndex + 1} failed: ${errorMsg}`);

      lastError = err;
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    }
  }

  throw new Error(`All Gemini API keys failed. Last error: ${lastError}`);
}

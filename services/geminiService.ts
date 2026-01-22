
import { GoogleGenAI, Type } from "@google/genai";

// Standardized initialization per Google GenAI SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const queryBusinessData = async (query: string, context: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Query: ${query}`,
      config: {
        systemInstruction: `Anda adalah asisten cerdas untuk sistem akuntansi UMKM bernama "BukuPintar". 
        Gunakan data bisnis berikut untuk menjawab pertanyaan pengguna dalam Bahasa Indonesia yang ramah dan profesional.
        
        DATA BISNIS:
        ${JSON.stringify(context, null, 2)}
        
        Instruksi:
        1. Jika ditanya tentang stok, sebutkan detail gudangnya.
        2. Jika ditanya tentang laporan keuangan, berikan ringkasan angka.
        3. Jika data tidak ditemukan, katakan sejujurnya dan tawarkan bantuan lain.
        4. Gunakan format Markdown untuk jawaban agar rapi (tabel, list, bold).`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, asisten AI sedang mengalami kendala teknis. Mohon coba beberapa saat lagi.";
  }
};

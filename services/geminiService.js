import dotenv from "dotenv";
dotenv.config();

import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

// =====================================================
// ENV + API KEY
// =====================================================

const API_KEY = process.env.GEMINI_API_KEY?.trim();

console.log("===================================");
console.log("GEMINI API KEY LOADED:", API_KEY ? "✅ Yes" : "❌ No");
console.log("API KEY LENGTH:", API_KEY?.length);
console.log("===================================");

if (!API_KEY) {
  console.error("❌ CRITICAL: No API key found in environment variables!");
  process.exit(1);
}

// =====================================================
// GEMINI CONFIG
// =====================================================

const genAI = new GoogleGenerativeAI(API_KEY);

// =====================================================
// GEMINI MODEL - USING WORKING MODEL FROM YOUR LIST
// =====================================================

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",

  generationConfig: {
    temperature: 0.2,
    topP: 0.8,
    topK: 20,
    maxOutputTokens: 300,
  },
});

// =====================================================
// ANALYZE FRUIT
// =====================================================

export const analyzeFruitWithGemini = async (imageBuffer, mimeType) => {
  try {
    console.log("===================================");
    console.log("STARTING GEMINI ANALYSIS...");
    console.log("IMAGE MIME TYPE:", mimeType);
    console.log("IMAGE BUFFER SIZE:", imageBuffer.length);

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    console.log("IMAGE CONVERTED TO BASE64");

    const prompt = `
Analyze this fruit image carefully.

Return ONLY valid JSON.

Required JSON format:

{
  "fruit": "",
  "ripeness": "",
  "confidence": 0,
  "recommendation": "",
  "details": ""
}

Rules:
- Detect exact fruit name
- Determine ripeness: ripe, unripe, overripe, rotten
- Confidence should be between 70 and 99
- recommendation should be short (1 sentence)
- details should explain fruit condition
- Return ONLY JSON, no other text or markdown formatting
`;

    console.log("PROMPT READY");
    console.log("SENDING REQUEST TO GEMINI...");

    const result = await model.generateContent([prompt, imagePart]);
    console.log("GEMINI RESPONSE RECEIVED");

    const response = await result.response;
    const text = response.text();
    
    console.log("===================================");
    console.log("RAW GEMINI RESPONSE:");
    console.log(text);
    console.log("===================================");

    // Clean the response
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Try to extract JSON if there's any extra text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    console.log("CLEANED RESPONSE:");
    console.log(cleaned);

    const parsed = JSON.parse(cleaned);
    
    console.log("===================================");
    console.log("PARSED JSON RESPONSE:");
    console.log(parsed);
    console.log("===================================");

    return parsed;
    
  } catch (error) {
    console.log("===================================");
    console.log("GEMINI ANALYSIS ERROR:");
    console.log(error);
    console.log("===================================");
    throw error;
  }
};
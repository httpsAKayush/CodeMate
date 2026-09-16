import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please define GEMINI_API_KEY in your backend/.env file.");
  }
  return new GoogleGenerativeAI(apiKey);
};

const SUPPORTED_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite"
];

const aiService = {
  generateHint: async (problem, currentCode, language) => {
    const genAI = getGeminiClient();
    
    const systemInstruction = `You are an expert pair-programming tutor and mentor for LeetCode coding challenges.
Your goal is to guide the user towards the solution by providing a short, encouraging, and pedagogical hint.
CRITICAL RULES:
1. DO NOT write or paste the full solution code.
2. DO NOT write large blocks of code. You may only suggest 1-2 lines of syntactical structure or helper boilerplate if absolutely necessary.
3. First, analyze the problem constraints and the user's current code to find logical bugs, syntax errors, or inefficient approaches.
4. Explain the conceptual bug or the next logical step in 2-3 clear and friendly sentences.
5. Ask a guiding question to encourage their own problem-solving.
6. Keep your entire response concise (under 80 words).`;

    const promptText = `
Problem Challenge: ${problem.title}
Problem Description:
${problem.description}

Programming Language selected: ${language}

Users' Current Code State in Monaco Editor:
\`\`\`${language}
${currentCode}
\`\`\`
`;

    let lastError = null;

    for (const modelName of SUPPORTED_MODELS) {
      try {
        console.log(`AI Hint: Attempting generation using model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\n${promptText}` }],
            },
          ],
        });

        const responseText = result.response.text();
        if (responseText && responseText.trim()) {
          console.log(`AI Hint: Successfully generated using model: ${modelName}`);
          return responseText.trim();
        }
      } catch (error) {
        console.warn(`AI Hint: Model ${modelName} failed. Reason:`, error.message || error);
        lastError = error;
      }
    }

    console.error("AI Hint: All Gemini models failed to generate a response.");
    throw new Error(
      lastError?.message || "Failed to generate AI hint across all supported models"
    );
  },
};

export default aiService;

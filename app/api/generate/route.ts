import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Setup the Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 2. Parse the User's Input
    const body = await req.json();
    const { topic, interest } = body; 
    // Example: topic="Blockchain", interest="Cricket"

    if (!topic || !interest) {
      return NextResponse.json({ error: "Missing topic or interest" }, { status: 400 });
    }

    // 3. Select the Model (Gemini 1.5 Flash is fast & free)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. AGENT 1: The "Mapper" 
    // This agent finds the connections between the two topics.
    const mapperPrompt = `
      You are an expert at analogies. 
      Task: Map the technical concept of '${topic}' to the domain of '${interest}'.
      
      Requirement:
      1. Identify 3 key components of '${topic}'.
      2. Find 3 equivalent counterparts in '${interest}'.
      
      Output JSON ONLY:
      {
        "concept": "${topic}",
        "domain": "${interest}",
        "mappings": [
          { "technical": "Key Term 1", "analogy": "Analogy Term 1", "reason": "Why?" },
          { "technical": "Key Term 2", "analogy": "Analogy Term 2", "reason": "Why?" },
          { "technical": "Key Term 3", "analogy": "Analogy Term 3", "reason": "Why?" }
        ]
      }
    `;

    const mapperResult = await model.generateContent(mapperPrompt);
    const mappingText = mapperResult.response.text();
    
    // Clean up JSON (sometimes AI adds backticks)
    const cleanJson = mappingText.replace(/```json|```/g, "").trim();

    // 5. AGENT 2: The "Explainer"
    // This agent takes the map and writes the final story.
    const explainerPrompt = `
      You are a fun, engaging teacher.
      
      Context: A student loves '${interest}' but struggles with '${topic}'.
      Use this mapping data to explain '${topic}' to them:
      ${cleanJson}

      Instructions:
      - Write a short, punchy explanation (max 4 sentences).
      - Use the specific analogies from the mapping.
      - Start with a catchy hook related to '${interest}'.
      - Do NOT mention "I have mapped this". Just teach.
    `;

    const explainerResult = await model.generateContent(explainerPrompt);
    const finalExplanation = explainerResult.response.text();

    // 6. Return the result to the Frontend
    return NextResponse.json({ 
      analogy: finalExplanation,
      raw_mapping: JSON.parse(cleanJson) // We send this back too, in case we want to show the "Logic" later!
    });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate analogy" }, { status: 500 });
  }
}
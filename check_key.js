// brute_force.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// 👇 PASTE YOUR KEY HERE 👇
const API_KEY = "AIzaSyDN_8qi1BnbycC7KnC4f1_jNhI2JeCEBOw"; 

const genAI = new GoogleGenerativeAI(API_KEY);

const SUSPECTS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-1.0-pro-latest",
  "gemini-2.0-flash-exp" // The newest experimental one
];

async function check(modelName) {
  process.stdout.write(`Testing ${modelName.padEnd(25)} ... `);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent("Test");
    console.log("✅ WORKS! USE THIS ONE.");
    return true;
  } catch (error) {
    if (error.message.includes("404") || error.message.includes("not found")) {
      console.log("❌ Not Found");
    } else if (error.message.includes("429")) {
      console.log("⚠️ Exists, but Quota Full (Wait 1 min)");
      return true; // Technically it works, just busy
    } else {
      console.log("❌ Error: " + error.message.split("[")[0]);
    }
    return false;
  }
}

async function run() {
  console.log("🔓 Starting Brute Force Check...\n");
  for (const name of SUSPECTS) {
    const success = await check(name);
    if (success) {
      console.log(`\n🎉 VICTORY! Update your route.ts with: "${name}"`);
      return;
    }
  }
  console.log("\n💀 All failed. Your API Key might be invalid or region-locked.");
}

run();
"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
export default function Home() {
  const [result, setResult] = useState("");

  const testAPI = async () => {
    setResult("Thinking...");
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ topic: "Quantum Physics", interest: "Marvel Movies" }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    
    <div className="p-10 bg-black text-white min-h-screen">
      <Navbar />
      <button onClick={testAPI} className="bg-blue-500 p-4 rounded">
        TEST BRAIN (Quantum + Marvel)
      </button>
      <pre className="mt-4 text-green-400 whitespace-pre-wrap">{result}</pre>
    </div>
  );
}
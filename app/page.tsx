"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Spline from '@splinetool/react-spline'; // 1. Import Spline

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
    // Main container needs relative positioning to hold the layers
    <main className="min-h-screen bg-black relative overflow-hidden">
      
      {/* LAYER 0: 3D Background (Fixed to screen) */}
      <div className="fixed inset-0 z-0">
        <Spline scene="https://prod.spline.design/qtPsCb7GXPdQivBA/scene.splinecode" />
      </div>

      {/* LAYER 1: Frontend Content (Clickable, on top) */}
      <div className="relative z-10 p-10 text-white">
        <Navbar />
        
        <div className="mt-20"> {/* Spacing for navbar */}
          <button onClick={testAPI} className="bg-blue-600 hover:bg-blue-500 transition p-4 rounded-xl font-bold shadow-lg">
            TEST BRAIN (Quantum + Marvel)
          </button>
          
          <pre className="mt-8 p-6 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-green-400 whitespace-pre-wrap">
            {result || "Waiting for input..."}
          </pre>
        </div>
      </div>

    </main>
  );
}
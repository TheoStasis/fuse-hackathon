"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Spline from '@splinetool/react-spline';
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Zap, BookOpen, Heart } from "lucide-react";

export default function Home() {
  // 1. STATE: These variables hold the user's data
  const [topic, setTopic] = useState("");
  const [interest, setInterest] = useState(""); // User types their passion here
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // Stores the AI response

  // 2. LOGIC: This function talks to your Brain (API)
  const handleGenerate = async () => {
    if (!topic || !interest) return; // Don't run if empty
    
    setLoading(true);
    setResult(null); // Clear old results

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, interest }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data); // Save the AI answer
    } catch (error) {
      console.error(error);
      alert("AI Brain Freeze! Try again.");
    } finally {
      setLoading(false); // Stop the spinner
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-x-hidden text-white selection:bg-blue-500/30">
      
      {/* LAYER 0: 3D Background */}
      <div className="fixed inset-0 z-0">
         <Spline scene="https://prod.spline.design/qtPsCb7GXPdQivBA/scene.splinecode" />
      </div>

      {/* LAYER 1: The App Interface */}
      <div className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <Navbar />

        {/* SECTION A: THE INPUT ENGINE (2 Cards + Center Button) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-20"
        >
          
          {/* Card 1: The Topic */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-blue-500/50 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-200">The Topic</h2>
            </div>
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quantum Physics"
              className="w-full bg-transparent border-b-2 border-white/20 py-3 text-2xl font-light focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
            />
          </div>

          {/* The Center Fuse Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleGenerate}
              disabled={loading || !topic || !interest}
              className="relative group bg-white text-black p-6 rounded-full hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:scale-100 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.7)]"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Zap className="w-8 h-8 fill-black" />
              )}
              <span className="sr-only">Fuse</span>
              
              {/* Optional: Label that appears on hover */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-sm font-bold tracking-widest text-white whitespace-nowrap">
                FUSE IT
              </div>
            </button>
          </div>

          {/* Card 2: The Passion */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-purple-500/50 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <Heart size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-200">Your Passion</h2>
            </div>
            <input 
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="e.g. Marvel Movies"
              className="w-full bg-transparent border-b-2 border-white/20 py-3 text-2xl font-light focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
            />
          </div>

        </motion.div>

        {/* SECTION B: THE RESULTS (Only shows when result exists) */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* 1. The Story Card */}
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
               <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">The Analogy</h3>
               <p className="text-2xl md:text-3xl leading-relaxed font-light text-gray-100">
                 {result.analogy}
               </p>
            </div>

            {/* 2. The Logic Flowchart (Arrows) */}
            <div className="grid gap-6">
              {result.raw_mapping.mappings.map((item: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }} // Stagger animation
                  className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center"
                >
                  
                  {/* Left: Technical Term */}
                  <div className="bg-black/40 border border-blue-500/30 p-6 rounded-2xl text-right">
                    <div className="text-xs text-blue-400 font-mono mb-1">CONCEPT</div>
                    <div className="text-xl font-bold">{item.technical}</div>
                  </div>

                  {/* Middle: Arrow */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full shadow-lg shadow-purple-500/20">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Right: Analogy Term */}
                  <div className="bg-black/40 border border-purple-500/30 p-6 rounded-2xl text-left">
                     <div className="text-xs text-purple-400 font-mono mb-1">ANALOGY</div>
                     <div className="text-xl font-bold">{item.analogy}</div>
                     <p className="text-sm text-gray-500 mt-2 italic">"{item.reason}"</p>
                  </div>

                </motion.div>
              ))}
            </div>

          </motion.div>
        )}

      </div>
    </main>
  );
}
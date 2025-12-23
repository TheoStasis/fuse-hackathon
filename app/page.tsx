"use client";

import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Spline from '@splinetool/react-spline';
import ExpandableNode from "./components/ExpandableNode";
import { motion } from "framer-motion";
import { Loader2, Zap, BookOpen, Heart } from "lucide-react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [interest, setInterest] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const splineRef = useRef<any>(null); 

  const handleGenerate = async () => {
    if (!topic || !interest) return; 
    
    setLoading(true);
    setResult(null); 

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, interest }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
      
      // Save to history
      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, interest, result: data }),
        });
      } catch (historyError) {
        // Silently fail - history saving shouldn't break the main flow
        console.error("Failed to save history:", historyError);
      }
    } catch {
      alert("AI Brain Freeze! Try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <main className="min-h-screen bg-black relative selection:bg-blue-500/30 font-sans">
      
      {/* ----------------------------------------------------- */}
      {/* LAYER 0: SPLINE BACKGROUND (Must receive events)      */}
      {/* ----------------------------------------------------- */}
      {/* Removed 'pointer-events-none' so Spline can detect hover */}
      <div className="fixed inset-0 z-0 opacity-60 bg-[#050405]">
         <Spline 
           scene="https://prod.spline.design/vGQwr-uT48fPnPpM/scene.splinecode"  //https://prod.spline.design/qtPsCb7GXPdQivBA/scene.splinecode
           onLoad={(spline: any) => {
             splineRef.current = spline;
           }}
         />
      </div>

      {/* ----------------------------------------------------- */}
      {/* LAYER 1: UI INTERFACE (Pass-Through Container)        */}
      {/* ----------------------------------------------------- */}
      {/* Added 'pointer-events-none' here so mouse falls through empty spaces */}
      <div className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen flex flex-col justify-center pointer-events-none">
        
        {/* Navbar needs to be clickable again */}
        <div className="pointer-events-auto">
           <Navbar />
        </div>

        {!result && (
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                FUSE.
              </h1>
              <p className="text-gray-400">Connect complex topics to things you love.</p>
            </div>
        )}

        {/* INPUT ENGINE */}
        <motion.div 
          layout 
          className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-16"
        >
          
          {/* Card 1: Add pointer-events-auto */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl hover:border-blue-500/50 transition-colors group pointer-events-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h2 className="text-lg font-bold text-gray-200">The Topic</h2>
            </div>
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Recursion"
              className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl md:text-2xl font-light focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700 text-white"
            />
          </div>

          {/* Button: Add pointer-events-auto */}
          <div className="flex justify-center z-20 pointer-events-auto">
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
            </button>
          </div>

          {/* Card 2: Add pointer-events-auto */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl hover:border-purple-500/50 transition-colors group pointer-events-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <Heart size={24} />
              </div>
              <h2 className="text-lg font-bold text-gray-200">Your Passion</h2>
            </div>
            <input 
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="e.g. Inception"
              className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl md:text-2xl font-light focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-700 text-white"
            />
          </div>

        </motion.div>

        {/* RESULTS ENGINE */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Story Card: Add pointer-events-auto */}
            <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden pointer-events-auto">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Decryption Complete</h3>
              <p className="text-lg md:text-xl leading-relaxed font-light text-gray-200">
                {result.analogy}
              </p>
            </div>

            {/* Nodes: Wrap in pointer-events-auto */}
            <div className="space-y-4">
              {result.raw_mapping.mappings.map((item: any, i: number) => (
                <div key={i} className="pointer-events-auto">
                  <ExpandableNode item={item} />
                </div>
              ))}
            </div>

          </motion.div>
        )}

      </div>
    </main>
  );
}

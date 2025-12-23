"use client";

import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Spline from '@splinetool/react-spline';
import ExpandableNode from "./components/ExpandableNode";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, BookOpen, Heart, ArrowRight, Mail, Lock } from "lucide-react";

type View = "LANDING" | "AUTH" | "APP";

export default function Home() {
  // View State
  const [view, setView] = useState<View>("LANDING");

  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // App State
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
        console.error("Failed to save history:", historyError);
      }
    } catch {
      alert("AI Brain Freeze! Try again.");
    } finally {
      setLoading(false); 
    }
  };

  const handleSignIn = () => {
    // Simulate login - in production, this would validate credentials
    if (email && password) {
      setView("APP");
    }
  };

  const handleGoogleSignIn = () => {
    // Dummy Google sign-in - implement OAuth later
    setView("APP");
  };

  return (
    <main className="min-h-screen bg-black relative selection:bg-blue-500/30 font-sans">
      
      {/* ----------------------------------------------------- */}
      {/* LAYER 0: SPLINE BACKGROUND (Always Rendered)          */}
      {/* ----------------------------------------------------- */}
      <div className="fixed inset-0 z-0 opacity-60 bg-[#050405] pointer-events-auto">
         <Spline 
           scene="https://prod.spline.design/vGQwr-uT48fPnPpM/scene.splinecode"
           onLoad={(spline: any) => {
             splineRef.current = spline;
           }}
         />
      </div>

      {/* ----------------------------------------------------- */}
      {/* LAYER 1: NAVBAR (Conditional - Hidden on AUTH view)   */}
      {/* ----------------------------------------------------- */}
      <AnimatePresence>
        {view !== "AUTH" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-auto relative z-10"
          >
            <Navbar isSignedIn={view === "APP"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------- */}
      {/* LAYER 2: VIEW CONTENT (Animated Transitions)          */}
      {/* ----------------------------------------------------- */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pointer-events-none">
        
        <AnimatePresence mode="wait">
          
          {/* ============================================ */}
          {/* VIEW 1: LANDING                              */}
          {/* ============================================ */}
          {view === "LANDING" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center pointer-events-auto"
            >
              <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6">
                FUSE.
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Connect complex topics to things you love. Transform learning into an adventure.
              </p>
              
              <button
                onClick={() => setView("AUTH")}
                className="group relative px-12 py-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full hover:border-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center gap-4">
                  <span className="text-2xl font-bold text-white">Get Started</span>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            </motion.div>
          )}

          {/* ============================================ */}
          {/* VIEW 2: AUTH (Sign In)                       */}
          {/* ============================================ */}
          {view === "AUTH" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-400">Sign in to continue your learning journey</p>
                </div>

                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleSignIn}
                  disabled={!email || !password}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  Sign In
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>

              </div>
            </motion.div>
          )}

          {/* ============================================ */}
          {/* VIEW 3: APP (Main Application)               */}
          {/* ============================================ */}
          {view === "APP" && (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl pt-32 pb-20"
            >
              
              {!result && (
                <div className="text-center mb-12 space-y-4 pointer-events-auto">
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
                
                {/* Topic Card */}
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

                {/* Generate Button */}
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

                {/* Interest Card */}
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
                  {/* Story Card */}
                  <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden pointer-events-auto">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Decryption Complete</h3>
                    <p className="text-lg md:text-xl leading-relaxed font-light text-gray-200">
                      {result.analogy}
                    </p>
                  </div>

                  {/* Expandable Nodes */}
                  <div className="space-y-4">
                    {result.raw_mapping.mappings.map((item: any, i: number) => (
                      <div key={i} className="pointer-events-auto">
                        <ExpandableNode item={item} />
                      </div>
                    ))}
                  </div>

                </motion.div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </main>
  );
}
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Loader2, AlertCircle, CheckCircle, HelpCircle, AlertTriangle, Link as LinkIcon, FileText } from "lucide-react";
import { analyzeNews, AnalysisResult } from "../services/ai";

export default function Analyzer() {
  const [newsText, setNewsText] = useState("");
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!newsText.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const analysis = await analyzeNews(newsText, mode === 'url');
      setResult(analysis);
      
      // Save to history
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newsText.substring(0, 200) + (newsText.length > 200 ? "..." : ""),
          type: mode,
          result: analysis
        })
      });
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Real": return "text-emerald-500 bg-emerald-500/10";
      case "Fake": return "text-red-500 bg-red-500/10";
      case "Misleading": return "text-amber-500 bg-amber-500/10";
      default: return "text-zinc-400 bg-zinc-400/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Real": return <CheckCircle className="w-6 h-6" />;
      case "Fake": return <AlertCircle className="w-6 h-6" />;
      case "Misleading": return <AlertTriangle className="w-6 h-6" />;
      default: return <HelpCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">AI News Analyzer</h2>
        <p className="text-zinc-400">Choose your input method and check news credibility.</p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => { setMode('url'); setNewsText(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            mode === 'url' 
              ? 'bg-nexus-amber text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
              : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          <LinkIcon className="w-5 h-5" />
          URL Link
        </button>
        <button
          onClick={() => { setMode('text'); setNewsText(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            mode === 'text' 
              ? 'bg-nexus-amber text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
              : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          <FileText className="w-5 h-5" />
          Text News
        </button>
      </div>

      <div className="nexus-card space-y-6">
        <div className="relative">
          {mode === 'url' ? (
            <input
              type="url"
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              placeholder="Paste news article URL here (e.g., https://bbc.com/news/...)"
              className="w-full bg-[#050810] border border-white/10 rounded-xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-nexus-amber transition-all"
            />
          ) : (
            <textarea
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              placeholder="Paste news article content or claim here..."
              className="w-full h-64 bg-[#050810] border border-white/10 rounded-xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-nexus-amber transition-all resize-none"
            />
          )}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !newsText.trim()}
            className={`${mode === 'url' ? 'mt-4 w-full relative' : 'absolute bottom-6 right-6'} btn-primary flex items-center justify-center gap-2`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze News
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-2xl font-black tracking-tight text-white">Analysis <span className="text-nexus-amber">Report</span></h3>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(result.status)}`}>
                {result.status}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Credibility Score Gauge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="nexus-card flex flex-col items-center justify-center p-10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-nexus-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-white/5"
                    />
                    <motion.circle
                      initial={{ strokeDashoffset: 364.4 }}
                      animate={{ strokeDashoffset: 364.4 - (364.4 * result.credibilityScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeDasharray={364.4}
                      className="text-nexus-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{result.credibilityScore}%</span>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Trust Score</span>
                  </div>
                </div>
              </motion.div>

              {/* Status & Verdict */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="nexus-card md:col-span-2 flex flex-col justify-center space-y-4 p-10"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(result.status)} bg-opacity-10`}>
                    {getStatusIcon(result.status)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Final Verdict</p>
                    <h4 className={`text-3xl font-black uppercase ${getStatusColor(result.status).split(' ')[0]}`}>
                      {result.status === 'Real' ? 'Verified Authentic' : result.status === 'Fake' ? 'Highly Suspicious' : 'Partially Verified'}
                    </h4>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.credibilityScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500`}
                  />
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed italic">
                  "Our AI models have processed the linguistic patterns and factual consistency of this content to provide this verdict."
                </p>
              </motion.div>
            </div>

            {/* Detailed Explanation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="nexus-card p-10 space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit className="w-32 h-32 text-nexus-amber" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-nexus-amber/10 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-nexus-amber" />
                </div>
                <h4 className="text-xl font-bold text-white">AI Reasoning & <span className="text-nexus-amber">Insights</span></h4>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed text-lg bg-white/5 p-6 rounded-2xl border border-white/5">
                  {result.explanation}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">Linguistic Patterns</p>
                    <p className="text-xs text-zinc-500">Analyzed for emotional bias and clickbait triggers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <AlertCircle className="w-5 h-5 text-nexus-amber mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">Source Consistency</p>
                    <p className="text-xs text-zinc-500">Cross-referenced with established news databases.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { BrainCircuit } from "lucide-react";

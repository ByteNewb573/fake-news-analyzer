import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Database, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-nexus-amber text-xs font-bold uppercase tracking-widest"
        >
          AI Fake News Detection
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tight"
        >
          Fake News <span className="text-nexus-amber">Analyzer</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Analyze news articles and detect misinformation using advanced AI algorithms. 
          Get credibility scores and verify sources instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 pt-4"
        >
          <Link
            to="/analyzer"
            className="btn-primary"
          >
            Start Analyzing
          </Link>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-32">
        {[
          {
            icon: Search,
            title: "Text Analysis",
            desc: "Paste news article text to instantly detect misinformation signals.",
            color: "text-red-400"
          },
          {
            icon: Zap,
            title: "AI Insights",
            desc: "Get detailed reasoning and insights from our advanced AI models.",
            color: "text-blue-400"
          },
          {
            icon: Database,
            title: "Analysis History",
            desc: "Review previously analyzed news and credibility reports.",
            color: "text-emerald-400"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="nexus-card group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-all ${feature.color} group-hover:scale-110 duration-300`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-nexus-amber transition-colors">{feature.title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm group-hover:text-zinc-300 transition-colors">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

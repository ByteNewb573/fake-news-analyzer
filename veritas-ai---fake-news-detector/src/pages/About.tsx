import { motion } from "motion/react";
import { BrainCircuit, Shield, Eye, Users, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-20">
      <div className="text-center space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tighter"
        >
          Fighting Misinformation with <br />
          <span className="text-emerald-500">Intelligence.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-xl leading-relaxed"
        >
          Veritas AI was built to empower individuals in the digital age. 
          In an era of rapid information flow, distinguishing truth from fiction 
          has never been more critical.
        </motion.p>
      </div>

      <div className="grid gap-12">
        {[
          {
            icon: BrainCircuit,
            title: "Advanced AI Engine",
            desc: "We leverage the latest Gemini 3 Flash models to perform deep semantic analysis and cross-referencing of information."
          },
          {
            icon: Shield,
            title: "Unbiased Verification",
            desc: "Our algorithms are designed to detect logical fallacies, emotional manipulation, and factual inconsistencies without political bias."
          },
          {
            icon: Globe,
            title: "Global Context",
            desc: "By analyzing news within a global context, we provide a more comprehensive view of the credibility of any given claim."
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-20 h-20 shrink-0 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500">
              <item.icon className="w-10 h-10" />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-[40px] p-12 text-center space-y-6">
        <h3 className="text-3xl font-bold">Our Mission</h3>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          To build a more informed society by providing accessible, 
          AI-driven tools that help people navigate the complex landscape 
          of modern media with confidence and clarity.
        </p>
      </div>
    </div>
  );
}

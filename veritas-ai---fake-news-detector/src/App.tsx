/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Search, History, Info, Menu, X, BrainCircuit, AlertTriangle, CheckCircle, HelpCircle, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import HistoryPage from "./pages/History";
import About from "./pages/About";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Shield },
    { name: "News Analyzer", path: "/analyzer", icon: Search },
    { name: "About", path: "/about", icon: Info },
    { name: "History", path: "/history", icon: History },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 nexus-glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-nexus-amber rounded-lg flex items-center justify-center rotate-45 group-hover:rotate-[135deg] transition-transform duration-500">
              <BrainCircuit className="w-6 h-6 text-black -rotate-45 group-hover:-rotate-[135deg] transition-transform duration-500" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">VERITAS <span className="text-nexus-amber">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path 
                    ? "bg-nexus-amber/10 text-nexus-amber" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-zinc-400">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-t border-white/10 px-4 pt-2 pb-6 space-y-1"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium ${
                  location.pathname === item.path ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-400"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="py-8 border-t border-white/5 text-center text-zinc-500 text-sm">
          <p>© 2026 Veritas AI. Powered by Gemini.</p>
        </footer>
      </div>
    </Router>
  );
}


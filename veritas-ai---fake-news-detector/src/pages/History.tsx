import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { History as HistoryIcon, Clock, Trash2, ExternalLink, ChevronRight, Link as LinkIcon, FileText } from "lucide-react";

interface HistoryEntry {
  id: string;
  timestamp: string;
  text: string;
  type?: 'text' | 'url';
  result: {
    status: string;
    credibilityScore: number;
    explanation: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<{ database: string; connected: boolean } | null>(null);

  useEffect(() => {
    fetchHistory();
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setDbStatus(data);
    } catch (e) {
      console.error("Status fetch failed", e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Real": return "text-emerald-500";
      case "Fake": return "text-red-500";
      case "Misleading": return "text-amber-500";
      default: return "text-zinc-400";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-emerald-500" />
            Analysis History
          </h2>
          <p className="text-zinc-400">Review your previous news credibility checks.</p>
        </div>
        {dbStatus && (
          <div className="flex flex-col items-end gap-2">
            <div className={`px-4 py-2 border border-white/10 rounded-lg ${dbStatus.connected ? 'text-emerald-500 bg-emerald-500/5' : 'text-amber-500 bg-amber-500/5'} font-bold uppercase text-xs`}>
              Storage: {dbStatus.database}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-nexus-amber/20 border-t-nexus-amber rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="nexus-card p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-zinc-500">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <p className="text-zinc-500 text-lg">No analysis history found. Start analyzing news to see them here!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nexus-card p-6 hover:bg-[#11182C] transition-all group cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleDateString()} • {new Date(entry.timestamp).toLocaleTimeString()}
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded border border-white/5">
                      {entry.type === 'url' ? <LinkIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {entry.type || 'text'}
                    </span>
                  </div>
                  <p className="text-zinc-200 font-medium line-clamp-1">{entry.text}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`font-bold ${getStatusColor(entry.result.status)}`}>
                      {entry.result.status}
                    </p>
                    <p className="text-xs text-zinc-500 font-bold">{entry.result.credibilityScore}% Score</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-nexus-amber transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

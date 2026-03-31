import { BarChart3 } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="h-20 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-30">
      <div className="flex items-center gap-4">
        {/* Logomark Parkshare */}
        <div className="bg-brand p-2 rounded-lg shadow-lg shadow-brand/10">
          <img src="/logomark.png" alt="Parkshare Logo" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-[#fcf8e6] font-black tracking-tighter text-xl uppercase">
            Parkshare <span className="text-brand">Analytics</span>
          </h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Database</span>
          </div>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-10">
        <Link href="/" className="text-xs font-black text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">
          Dashboard
        </Link>
        <Link href="/analytics" className="text-xs font-black text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">
          Analyses
        </Link>
        <button className="bg-white/5 hover:bg-brand hover:text-black text-[#fcf8e6] px-5 py-2.5 rounded-xl text-xs font-black transition-all border border-white/10 uppercase tracking-widest">
          Mode Admin
        </button>
      </nav>
    </header>
  );
}
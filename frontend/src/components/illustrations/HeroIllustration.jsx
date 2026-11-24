import React from 'react';

export default function HeroIllustration() {
  return (
    <div className="relative w-full border border-black bg-white p-4 sm:p-6 select-none font-mono text-xs overflow-hidden">
      {/* Top Drafting Meta Strip */}
      <div className="flex items-center justify-between border-b border-black pb-3 mb-4 text-[10px] text-zinc-500 uppercase tracking-widest">
        <span>FIG 01.0 // MULTIMODAL INTAKE PIPELINE</span>
        <span className="hidden sm:inline">RESOLUTION: VECTOR SCALE</span>
        <span className="text-black font-bold">STATUS: RUNNING</span>
      </div>

      {/* SVG Canvas Schematic */}
      <div className="relative min-h-[440px] sm:min-h-0 sm:aspect-[16/9] w-full border border-black bg-zinc-50 overflow-hidden flex items-center justify-center">
        {/* Animated Background Grid Lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Dynamic Architectural Schematic */}
        <div className="relative z-10 w-full h-full p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Left Block: Raw Handwritten & PDF Intake */}
          <div className="md:col-span-5 border-2 border-black bg-white p-4 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group">
            <div className="flex items-center justify-between border-b border-black pb-2 text-[10px] font-bold uppercase">
              <span className="text-swiss-red">● INTAKE INPUT</span>
              <span className="text-zinc-500">RAW NOTEBOOK</span>
            </div>

            {/* Handwritten simulation lines */}
            <div className="space-y-2 py-1 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black rounded-none" />
                <span className="text-xs font-bold text-zinc-800 tracking-tight">
                  AVL Tree: BF = H(L) - H(R)
                </span>
              </div>
              <div className="text-[11px] text-zinc-600 italic bg-amber-50/60 p-1.5 border border-amber-200">
                "যদি BF &gt; 1 হয় তেন্তে LL বা LR ঘূৰ্ণন প্ৰয়োগ কৰা হয়..." (Assamese / Hindi)
              </div>
              <div className="text-[11px] text-zinc-600 font-mono bg-zinc-100 p-1.5 border border-zinc-300">
                Need[i][j] = Max[i][j] - Alloc[i][j]
              </div>
            </div>

            {/* Simulated Animated Laser Scanline */}
            <div className="absolute inset-x-0 h-0.5 bg-swiss-red shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse top-1/2" />
          </div>

          {/* Center Pipeline Node (Direction Arrow & Token Processing) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center space-y-1 py-2">
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-black text-white">
              OCR // GROQ
            </span>
            <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs font-black animate-spin duration-1000">
              ⚡
            </div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              &lt;2.1s
            </span>
          </div>

          {/* Right Block: Structured Digital Notes Output & Exam Card */}
          <div className="md:col-span-5 border-2 border-black bg-black text-white p-4 space-y-3 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-2 text-[10px] font-bold uppercase">
              <span className="text-emerald-400">✓ STRUCTURED UNIT</span>
              <span className="text-zinc-400">READY</span>
            </div>

            <div className="space-y-1.5 font-sans">
              <h5 className="text-xs font-black uppercase text-white tracking-tight">
                # Binary Search Trees (AVL)
              </h5>
              <div className="text-[10px] font-mono text-zinc-300 space-y-0.5">
                <p>• Balance Factor invariant: -1, 0, +1</p>
                <p>• 4 Rotation mechanisms (LL, RR, LR, RL)</p>
                <p className="text-emerald-300 font-bold">✓ Exam Drill Synthesized (3 MCQs, 1 Written)</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[9px] font-mono">
              <span className="px-1.5 py-0.5 bg-white text-black font-bold uppercase">DIGITAL MARKDOWN</span>
              <span className="text-zinc-400 uppercase">LATEX ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Caption */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 pt-3 text-[10px] text-zinc-600">
        <span className="uppercase font-bold text-black">
          FIGURE 01.1 — SYSTEMATIC TRANSLATION: UNSTRUCTURED ARTIFACT → RIGOROUS ACADEMIC LEDGER
        </span>
        <span className="font-mono text-zinc-400">SCALE: 1:1 FULL DUPLEX</span>
      </div>
    </div>
  );
}

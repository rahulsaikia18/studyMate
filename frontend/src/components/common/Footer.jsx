import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black text-black text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-200">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-black text-white font-bold text-xs flex items-center justify-center">
                S
              </span>
              <span className="font-extrabold uppercase tracking-tight text-sm text-black">
                StudyMate Platform
              </span>
              <span className="text-[10px] bg-zinc-200 px-1 py-0.5 text-black">ED. 2026</span>
            </div>
            <p className="text-zinc-600 text-xs max-w-sm leading-relaxed font-sans font-normal">
              An intelligent, structured learning environment designed for university scholars. Transcribe lecture materials, clarify difficult concepts, and evaluate knowledge with objective precision.
            </p>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest pt-1">
              LOCALE: EN / HI / AS • STANDARDS COMPLIANT
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              Core Modules
            </h4>
            <ul className="space-y-1.5 text-zinc-600">
              <li><Link to="/notes/upload" className="hover:text-black hover:underline">01 // Document Intake</Link></li>
              <li><Link to="/ai-learning" className="hover:text-black hover:underline">02 // Concept Explainer</Link></li>
              <li><Link to="/practice" className="hover:text-black hover:underline">03 // Exam Simulation</Link></li>
              <li><Link to="/flashcards" className="hover:text-black hover:underline">04 // Active Flashcards</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              Directory
            </h4>
            <ul className="space-y-1.5 text-zinc-600">
              <li><Link to="/community" className="hover:text-black hover:underline">Shared Notes Registry</Link></li>
              <li><Link to="/planner" className="hover:text-black hover:underline">Curriculum Timeline</Link></li>
              <li><Link to="/dashboard" className="hover:text-black hover:underline">Student Terminal</Link></li>
              <li><Link to="/profile" className="hover:text-black hover:underline">Academic Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} STUDYMATE INTERNATIONAL. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-3">
            <span>LLAMA-3.3 ARCHITECTURE</span>
            <span>•</span>
            <span className="text-black font-bold">SWISS TYPOGRAPHIC SPEC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

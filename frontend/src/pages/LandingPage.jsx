import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowRight,
  Plus,
  ArrowUpRight,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      index: '01',
      title: 'PHOTO & PDF DIGITIZATION',
      desc: 'Transcribe handwritten notebooks and lecture slides. Automatically structures raw inputs into hierarchical headings, core definitions, and bulleted takeaways.',
      tag: 'OCR / VISION',
    },
    {
      index: '02',
      title: 'EXAM-GRADE EXPLANATIONS',
      desc: 'Highlight any complex paragraph or theorem. The AI engine eliminates academic jargon, delivering step-by-step analogies and exam marking rubrics.',
      tag: 'EXPLAIN ENGINE',
    },
    {
      index: '03',
      title: 'QUESTION GENERATOR',
      desc: 'Synthesize practice exams directly from study material. Generates MCQs, True/False, and written short questions categorized by difficulty.',
      tag: 'ACTIVE DRILL',
    },
    {
      index: '04',
      title: 'AI EVALUATION & FEEDBACK',
      desc: 'Instant auto-scoring for objective questions paired with natural language evaluation of written responses, awarding marks and constructive critiques.',
      tag: 'INSTANT GRADING',
    },
    {
      index: '05',
      title: '3D ACTIVE-RECALL FLASHCARDS',
      desc: 'Master core formulas and definitions through interactive double-sided flashcards optimized for spaced repetition and retention mastery.',
      tag: 'RETENTION',
    },
    {
      index: '06',
      title: 'SEMESTER STUDY PLANNER',
      desc: 'Algorithmic timeline construction based on exam deadlines, syllabus volume, and daily study capacity with milestone check-offs.',
      tag: 'CADENCE',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between">
      {/* Top International Strip */}
      <div className="border-b border-black bg-zinc-100 py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-zinc-600">
        <span>ISSUE 2026 // ACADEMIC COGNITION</span>
        <span className="hidden sm:inline">GROQ LLAMA HIGH-SPEED INFERENCE</span>
        <span>STANDARDS: ISO/IEC 2382</span>
      </div>

      {/* Hero Section */}
      <section className="border-b border-black px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Title Left (Massive Swiss Grotesque) */}
          <div className="lg:col-span-8 space-y-6">
            <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest block">
              00 / SYSTEM ARCHITECTURE
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tightest leading-[0.92] uppercase text-black">
              SMART STUDY.<br />
              STRUCTURED.<br />
              EVALUATED.
            </h1>
            <p className="text-lg sm:text-xl text-zinc-700 max-w-2xl font-normal leading-relaxed pt-2">
              Transform unstructured handwritten notes and course documents into structured digital study systems. Instant concept explanations, AI question synthesis, and automated written evaluation.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-swiss-red transition-colors"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-swiss-red transition-colors"
                  >
                    <span>Start System</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/community"
                    className="px-6 py-4 border border-black bg-white text-black text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors"
                  >
                    <span>Browse Notes Directory</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Metric Box Right (Clean Swiss Tabular Grid) */}
          <div className="lg:col-span-4 border border-black bg-zinc-50 p-6 space-y-6 font-mono">
            <div className="border-b border-black pb-3">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">SPECIFICATION MATRIX</span>
              <h3 className="text-xl font-bold uppercase tracking-tight text-black mt-1">StudyMate Core</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">SUPPORTED SCRIPTS</span>
                <span className="font-bold">ENG / HIN / ASM</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">INFERENCE LATENCY</span>
                <span className="font-bold">&lt; 2.50 SECONDS</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">EVALUATION ENGINE</span>
                <span className="font-bold">MULTI-CRITERIA AI</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">DEPLOYMENT STATUS</span>
                <span className="font-bold text-emerald-600">PRODUCTION READY</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-zinc-500 block leading-normal">
                Designed under rigorous functional typographic principles for uninterrupted student focus.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Feature Matrix (International Asymmetric Grid) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between border-b border-black pb-4 mb-8">
          <div>
            <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest block">
              01 / MODULE SPECIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1">
              Engineered Capabilities
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-500 uppercase hidden sm:inline">
            [ 06 FUNCTIONAL NODES ]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
          {features.map((feat) => (
            <div
              key={feat.index}
              className="border-r border-b border-black p-6 sm:p-8 flex flex-col justify-between hover:bg-zinc-50 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-4">
                  <span className="font-black text-base text-black group-hover:text-swiss-red transition-colors">
                    {feat.index}
                  </span>
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-black mb-3 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-200 flex items-center justify-between text-xs font-mono font-bold uppercase">
                <span className="text-zinc-400 group-hover:text-black">Standard Mode</span>
                <span className="text-black group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Systematic 4-Stage Workflow Strip */}
      <section className="border-t border-black bg-zinc-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-zinc-700 pb-4 mb-10 flex items-baseline justify-between">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
              02 / PROCESS PIPELINE
            </span>
            <span className="font-mono text-xs text-zinc-400 uppercase">
              STUDENT EXECUTION FLOW
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-l border-zinc-700 pl-4 space-y-2">
              <span className="font-mono text-xl font-bold text-swiss-red">I. INPUT</span>
              <h4 className="text-sm font-bold uppercase">Capture & Ingest</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Photograph handwritten pages or drag PDF files into the secure intake terminal.
              </p>
            </div>

            <div className="border-l border-zinc-700 pl-4 space-y-2">
              <span className="font-mono text-xl font-bold text-zinc-400">II. STRUCT</span>
              <h4 className="text-sm font-bold uppercase">Automated Layout</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Raw transcription is formatted into markdown headings, formulas, and terminology.
              </p>
            </div>

            <div className="border-l border-zinc-700 pl-4 space-y-2">
              <span className="font-mono text-xl font-bold text-zinc-400">III. VERIFY</span>
              <h4 className="text-sm font-bold uppercase">Exam Question Synthesis</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Attempt MCQs and written questions with immediate multi-point grading rubrics.
              </p>
            </div>

            <div className="border-l border-zinc-700 pl-4 space-y-2">
              <span className="font-mono text-xl font-bold text-zinc-400">IV. RETENTION</span>
              <h4 className="text-sm font-bold uppercase">Active Recall & Schedule</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drill formula flashcards and follow day-by-day revision milestones until exam day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCw,
  Sparkles,
  UploadCloud,
  FileText,
  Award,
  Layers,
  Calendar,
} from 'lucide-react';

export default function OnboardingGuideModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      stepNumber: '01',
      title: 'INTAKE HANDWRITTEN NOTES OR PDF',
      subtitle: 'Multimodal OCR Document Processing',
      description:
        'Capture handwritten lecture sheets, textbook scans, or university slide decks in JPG, PNG, or PDF format. StudyMate automatically extracts multilingual scripts including English, Hindi, and Assamese.',
      badge: 'INTAKE TERMINAL',
      icon: UploadCloud,
      animationVisual: (
        <div className="border border-black bg-zinc-50 p-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-black pb-2 text-[10px]">
            <span className="font-bold uppercase text-swiss-red">● SCANNING DOCUMENT</span>
            <span className="text-zinc-400">RESOLUTION: 300 DPI</span>
          </div>
          <div className="p-4 border-2 border-dashed border-black bg-white text-center space-y-2 relative overflow-hidden">
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-0 h-0.5 bg-swiss-red shadow-[0_0_10px_#dc2626] animate-[bounce_2s_infinite]" />
            <div className="text-zinc-600 font-sans text-xs italic">
              "Handwritten Lecture 3: AVL Tree balance factor = Left - Right height..."
            </div>
            <span className="inline-block px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase mt-2">
              OCR EXTRACTING → 98.4% ACCURACY
            </span>
          </div>
        </div>
      ),
    },
    {
      stepNumber: '02',
      title: 'ORGANIZED DIGITAL STUDY SHEETS',
      subtitle: 'Automated Markdown & Formula Structuring',
      description:
        'Raw transcriptions are automatically organized into clean semantic headings, bullet points, core definitions, and mathematical equations with LaTeX formatting.',
      badge: 'STRUCTURE ENGINE',
      icon: FileText,
      animationVisual: (
        <div className="border border-black bg-white p-4 space-y-2 font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-1.5 text-[10px]">
            <span className="font-bold uppercase text-emerald-600">✓ FORMATTED MARKDOWN</span>
            <span className="text-zinc-400">AUTO-INDEXED</span>
          </div>
          <div className="space-y-1 font-sans text-xs text-black">
            <h5 className="font-black text-sm uppercase"># Binary Search Trees</h5>
            <p className="text-zinc-600">• Balance Factor must remain in {-1, 0, 1}</p>
            <div className="p-2 border border-black bg-zinc-50 text-[11px] font-mono">
              $$\text{BalanceFactor}(N) = h(L) - h(R)$$
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: '03',
      title: 'EXPLAIN THIS (EXAM-FOCUSED AI)',
      subtitle: 'Zero Jargon & University Marking Tips',
      description:
        'Highlight any confusing paragraph directly within your notes. StudyMate breaks it down into simple language, explains common exam pitfalls, and provides practical examples.',
      badge: 'CONCEPT DECOMPOSITION',
      icon: Sparkles,
      animationVisual: (
        <div className="border border-black bg-zinc-50 p-4 space-y-2 font-mono text-xs">
          <div className="border border-black bg-white p-2.5 text-xs font-sans">
            <span className="bg-black text-white px-1 font-mono text-[10px] uppercase mr-1">SELECTED</span>
            <span className="bg-amber-100 text-black">"LL rotation occurs when unbalanced left-left child..."</span>
          </div>
          <div className="p-3 border-l-4 border-black bg-white space-y-1">
            <span className="text-[10px] font-bold uppercase text-swiss-red font-mono block">
              // STUDYMATE EXPLANATION:
            </span>
            <p className="font-sans text-xs text-zinc-800 leading-snug">
              Think of LL rotation as re-centering a tilted balance scale: pulling the middle node up creates a perfectly balanced symmetric triangle.
            </p>
          </div>
        </div>
      ),
    },
    {
      stepNumber: '04',
      title: 'MULTI-POINT EXAM EVALUATION',
      subtitle: 'Objective Auto-Grading & Written AI Rubrics',
      description:
        'Synthesize practice exams with MCQs, True/False, and written short answer questions. The AI examiner evaluates your written sentences, awards marks, and details missing points.',
      badge: 'ACADEMIC ASSESSMENT',
      icon: Award,
      animationVisual: (
        <div className="border border-black bg-white p-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-black pb-1.5">
            <span className="font-bold text-black uppercase">QUESTION 01 (WRITTEN)</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-300">
              MARKS: 1.5 / 2.0
            </span>
          </div>
          <p className="font-sans text-xs text-zinc-800 font-bold">
            "Explain when LL rotation is triggered."
          </p>
          <div className="p-2 border border-zinc-200 bg-zinc-50 font-sans text-[11px] text-zinc-700 leading-snug">
            <span className="font-bold font-mono text-[10px] uppercase block text-zinc-500">EXAMINER CRITIQUE:</span>
            Correct mechanism identified. To get full 2.0 marks in university exams, explicitly state that balance factor reaches +2.
          </div>
        </div>
      ),
    },
    {
      stepNumber: '05',
      title: 'ACTIVE RECALL & TIMELINE CADENCE',
      subtitle: '3D Flashcards & Milestone Scheduling',
      description:
        'Flip active-recall flashcards for important formulas and track your target exam countdown with automated day-by-day study targets.',
      badge: 'RETENTION & CADENCE',
      icon: Layers,
      animationVisual: (
        <div className="border border-black bg-zinc-50 p-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-black pb-1.5">
            <span className="font-bold uppercase text-black">FLASHCARD ACTIVE RECALL</span>
            <span className="text-[10px] text-zinc-500 uppercase">3D ROTATION</span>
          </div>
          <div className="p-4 border-2 border-black bg-black text-white text-center space-y-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">FRONT SIDE</span>
            <h6 className="font-sans font-bold text-sm uppercase">Balance Factor Formula</h6>
            <span className="inline-block px-2 py-0.5 border border-zinc-500 text-[9px] uppercase mt-1">
              CLICK TO ROTATE REVERSE
            </span>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const current = steps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
      navigate('/notes/upload');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-none animate-in fade-in font-mono">
      <div className="bg-white w-full max-w-3xl border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Strip */}
        <div className="px-6 py-4 border-b border-black bg-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 bg-black text-white font-bold text-xs flex items-center justify-center">
              S
            </span>
            <div>
              <span className="text-[10px] font-bold text-swiss-red uppercase tracking-widest block">
                SYSTEM OPERATIONAL MANUAL // GUIDE
              </span>
              <h3 className="font-extrabold uppercase text-black text-sm font-sans">
                How StudyMate Works: 5 Essential Steps
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Index Selector Strip */}
        <div className="flex border-b border-black text-xs font-bold divide-x divide-black bg-zinc-50">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 py-2 text-center uppercase transition-colors ${
                currentStep === idx
                  ? 'bg-black text-white'
                  : 'text-zinc-600 hover:bg-zinc-200 hover:text-black'
              }`}
            >
              <span>{s.stepNumber}</span>
              <span className="hidden sm:inline text-[10px] ml-1 font-normal opacity-70">
                / {s.badge.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-black text-white uppercase">
                STEP {current.stepNumber}
              </span>
              <span className="text-xs text-swiss-red font-bold uppercase tracking-wider">
                {current.badge}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 uppercase">
              {currentStep + 1} OF {steps.length}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-black font-sans leading-tight">
              {current.title}
            </h2>
            <p className="text-xs text-zinc-500 uppercase mt-1">
              {current.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans font-normal border-l-2 border-black pl-3 py-1">
            {current.description}
          </p>

          {/* Animated Demonstration Panel */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
              LIVE SYSTEM VISUALIZATION:
            </span>
            {current.animationVisual}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 border-t border-black bg-zinc-50 flex items-center justify-between text-xs font-mono">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-black bg-white hover:bg-zinc-100 uppercase font-bold flex items-center gap-1.5 disabled:opacity-30 disabled:hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-black hover:bg-swiss-red text-white uppercase font-bold flex items-center gap-2 tracking-wider transition-colors shadow-sm"
          >
            <span>{currentStep === steps.length - 1 ? 'Start Uploading' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

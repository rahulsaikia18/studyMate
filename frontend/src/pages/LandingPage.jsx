import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeroIllustration from '../components/illustrations/HeroIllustration.jsx';
import MultilingualOCRIllustration from '../components/illustrations/MultilingualOCRIllustration.jsx';
import OnboardingGuideModal from '../components/common/OnboardingGuideModal.jsx';
import ScrollAnimatedCard from '../components/common/ScrollAnimatedCard.jsx';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

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

  const comparison = [
    {
      capability: 'Notes Transcription',
      traditional: 'Manual re-typing or disorganized notebook photos',
      studymate: 'Instant OCR formatting into structured markdown with LaTeX formulas',
    },
    {
      capability: 'Concept Clarification',
      traditional: 'Hours searching unstructured forum threads or dense textbooks',
      studymate: '1-click exam-grade explanations tailored for university marking rubrics',
    },
    {
      capability: 'Exam Readiness Check',
      traditional: 'Passive rereading with zero feedback on written test answers',
      studymate: 'AI-synthesized MCQs & written answers evaluated with marks breakdown',
    },
    {
      capability: 'Revision Retention',
      traditional: 'Cramming the night before with high forgetting curve',
      studymate: '3D interactive active-recall flashcards & automated 7-day milestone cadence',
    },
    {
      capability: 'Script Ingestion',
      traditional: 'English only, fails on non-Latin scripts',
      studymate: 'Verified multilingual engine supporting English, Hindi & Assamese',
    },
  ];

  const testimonials = [
    {
      student: 'Rohit Sharma',
      degree: 'B.Tech Computer Science (Semester 4)',
      quote:
        'Converting 40-page handwritten notes on Operating Systems into structured digital bullet points saved me at least 15 hours before midterms. The written evaluation gave me exact critique on what was missing.',
    },
    {
      student: 'Ananya Barua',
      degree: 'B.Sc Physics Honours (Semester 3)',
      quote:
        'The Assamese and Hindi handwriting OCR worked flawlessly on my laboratory derivation sheets. Being able to highlight formulas and click "Explain This" makes self-study dramatically faster.',
    },
    {
      student: 'Devendra Patel',
      degree: 'B.Com / Finance (Semester 2)',
      quote:
        'The question generator creates realistic exam MCQs straight out of my textbook chapters. My quiz score jumped from 68% to 92% in 2 weeks.',
    },
  ];

  const faqs = [
    {
      q: 'How accurately does StudyMate transcribe handwritten notebook pages?',
      a: 'StudyMate uses high-throughput multimodal vision models optimized for handwriting across English, Hindi, and Assamese scripts. For best results, ensure uniform lighting when capturing photos.',
    },
    {
      q: 'How does the written answer evaluation award marks?',
      a: 'Unlike basic MCQ checkers, our evaluation engine analyzes your written sentences against standard university model answers, checks for key definitions, equations, and terminology, and awards proportional marks with constructive critique.',
    },
    {
      q: 'Can I download or share my notes with classmates?',
      a: 'Yes. Every note can be exported as clean formatted Markdown or published to the Community Notes Registry where students from any university can preview, download, or save copies.',
    },
    {
      q: 'What AI model powers the speed of StudyMate?',
      a: 'StudyMate is powered by ultra-low latency Groq Llama architecture, generating complete structured notes, 10-question exams, and flashcards in under 3 seconds.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between font-mono">
      {/* Top International Strip */}
      <div className="border-b border-black bg-zinc-100 py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-zinc-600">
        <span>ISSUE 2026 // ACADEMIC COGNITION</span>
        <span className="hidden sm:inline">GROQ LLAMA HIGH-SPEED INFERENCE</span>
        <button
          onClick={() => setGuideModalOpen(true)}
          className="text-swiss-red font-bold hover:underline flex items-center gap-1"
        >
          <span>HOW IT WORKS [GUIDED TOUR]</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="border-b border-black px-4 sm:px-6 lg:px-8 py-14 lg:py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Title Left (Massive Swiss Grotesque) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest block">
              00 / SYSTEM ARCHITECTURE
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tightest leading-[0.92] uppercase text-black font-sans">
              SMART STUDY.<br />
              STRUCTURED.<br />
              EVALUATED.
            </h1>
            <p className="text-sm sm:text-base text-zinc-700 max-w-xl font-sans font-normal leading-relaxed pt-1">
              Transform unstructured handwritten notes and course documents into structured digital study systems. Instant concept explanations, AI question synthesis, and automated written evaluation.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                    className="px-8 py-4 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-swiss-red transition-colors shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]"
                  >
                    <span>Start System</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setGuideModalOpen(true)}
                    className="px-6 py-4 border border-black bg-white text-black text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-swiss-red" />
                    <span>Watch How It Works</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Hero Custom SVG Graphic Right */}
          <div className="lg:col-span-6">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Structured Feature Matrix with Mobile Left-Right Scroll & Hover Inversion */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between border-b border-black pb-4 mb-6">
          <div>
            <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest block">
              01 / MODULE SPECIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1 font-sans">
              Engineered Capabilities
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-500 uppercase hidden sm:inline">
            [ SWIPE HORIZONTALLY ON MOBILE ]
          </span>
        </div>

        {/* Animated Cards Grid: Alternating Left/Right on Mobile, Bottom-Up on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feat, idx) => (
            <ScrollAnimatedCard key={feat.index} index={idx} className="h-full">
              <div className="h-full border border-black p-6 sm:p-8 flex flex-col justify-between bg-white hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="font-black text-base text-black group-hover:text-swiss-red transition-colors">
                      {feat.index}
                    </span>
                    <span className="px-2 py-0.5 bg-black text-white group-hover:bg-swiss-red group-hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-black group-hover:text-white mb-3 leading-snug font-sans transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-zinc-600 group-hover:text-zinc-300 leading-relaxed font-sans font-normal transition-colors">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-200 group-hover:border-zinc-800 flex items-center justify-between text-xs font-bold uppercase transition-colors">
                  <span className="text-zinc-400 group-hover:text-zinc-300">Active Standard</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </ScrollAnimatedCard>
          ))}
        </div>
      </section>

      {/* Multilingual OCR Recognition Section */}
      <section className="border-t border-black bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-black pb-4">
            <div>
              <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
                02 / MULTILINGUAL OCR SPECIFICATION
              </span>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight text-black mt-1 font-sans">
                Native Script Ingestion Engine
              </h2>
            </div>
            <p className="text-xs text-zinc-500 uppercase">
              RECOGNIZING ENGLISH, HINDI (हिन्दी) & ASSAMESE (অসমীয়া)
            </p>
          </div>

          <MultilingualOCRIllustration />
        </div>
      </section>

      {/* Feature Comparison Matrix Section (Traditional vs StudyMate) */}
      <section className="border-t border-black py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="border-b border-black pb-4 mb-8">
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
            03 / SYSTEMATIC EVALUATION MATRIX
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1 font-sans">
            Traditional Study vs StudyMate Architecture
          </h2>
        </div>

        {/* Responsive Swiss Comparison Matrix */}
        <div className="border border-black bg-white overflow-hidden">
          {/* Desktop / Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse table-fixed">
              <thead>
                <tr className="border-b border-black bg-zinc-100 font-mono font-bold uppercase text-black">
                  <th className="p-4 border-r border-black w-[28%]">CAPABILITY / WORKFLOW</th>
                  <th className="p-4 border-r border-black w-[36%] text-zinc-500">TRADITIONAL METHODS</th>
                  <th className="p-4 w-[36%] text-black bg-zinc-200/60 font-black">STUDYMATE ACADEMIC PLATFORM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black font-sans text-xs">
                {comparison.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold uppercase border-r border-black align-top text-black">
                      {item.capability}
                    </td>
                    <td className="p-4 text-zinc-600 border-r border-black align-top">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-swiss-red flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item.traditional}</span>
                      </div>
                    </td>
                    <td className="p-4 text-black font-bold bg-zinc-50/70 align-top">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 stroke-[3]" />
                        <span className="leading-relaxed">{item.studymate}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card-by-Card View (Perfect fit on small screens) */}
          <div className="sm:hidden divide-y divide-black font-mono text-xs">
            {comparison.map((item, idx) => (
              <div key={idx} className="p-4 space-y-3 bg-white">
                <div className="font-bold uppercase text-black border-b border-zinc-200 pb-1.5 flex items-center justify-between">
                  <span>{item.capability}</span>
                  <span className="text-[10px] text-zinc-400">#{idx + 1}</span>
                </div>

                {/* Traditional */}
                <div className="p-3 bg-red-50/50 border border-zinc-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-swiss-red flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    Traditional Method:
                  </span>
                  <p className="text-xs font-sans text-zinc-700 leading-snug pl-4">
                    {item.traditional}
                  </p>
                </div>

                {/* StudyMate */}
                <div className="p-3 bg-zinc-50 border border-black space-y-1">
                  <span className="text-[10px] uppercase font-bold text-black flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    StudyMate Platform:
                  </span>
                  <p className="text-xs font-sans text-black font-bold leading-snug pl-4">
                    {item.studymate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Student Testimonials Strip */}
      <section className="border-t border-black bg-zinc-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b border-zinc-700 pb-4 flex items-baseline justify-between">
            <span className="text-xs text-swiss-red uppercase font-bold tracking-widest">
              04 / VERIFIED SCHOLAR FIELD REPORTS
            </span>
            <span className="text-xs text-zinc-400 uppercase hidden sm:inline">
              ACADEMIC SUCCESS STORIES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="border border-zinc-700 bg-black p-6 space-y-4 hover:border-white hover:bg-zinc-800 transition-all cursor-default"
              >
                <span className="text-xs font-bold text-zinc-500 uppercase">REPORT #{idx + 1}</span>
                <p className="text-xs font-sans text-zinc-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="pt-3 border-t border-zinc-800">
                  <h5 className="font-bold uppercase text-white text-xs">{t.student}</h5>
                  <p className="text-[10px] text-zinc-400 uppercase">{t.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="border-t border-black py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="border-b border-black pb-4 mb-8">
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
            05 / FREQUENTLY ANSWERED INQUIRIES
          </span>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-black mt-1 font-sans">
            Technical & Academic Clarifications
          </h2>
        </div>

        <div className="border border-black divide-y divide-black bg-white">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-xs font-bold uppercase hover:bg-zinc-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-swiss-red font-mono">Q{idx + 1}.</span>
                    <span className="font-sans text-sm font-bold text-black">{faq.q}</span>
                  </span>
                  <span className="font-mono text-base">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-700 font-sans leading-relaxed border-t border-zinc-100 bg-zinc-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action Terminal */}
      <section className="border-t border-b border-black bg-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
            DEPLOY STUDYMATE TO YOUR ACADEMIC LIFE
          </span>
          <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black font-sans">
            Ready to master your curriculum?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 font-sans max-w-xl mx-auto leading-relaxed">
            Create an account in 30 seconds. Digitize handwritten pages, synthesize custom exam drills, and track your syllabus countdown.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-swiss-red transition-colors w-full sm:w-auto"
            >
              Enroll Student Account Now
            </Link>
            <button
              onClick={() => setGuideModalOpen(true)}
              className="px-6 py-4 border border-black bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors w-full sm:w-auto"
            >
              View Guided Tour
            </button>
          </div>
        </div>
      </section>

      {/* Onboarding / How It Works Modal */}
      <OnboardingGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/slices/authSlice.js';
import { fetchNotes, deleteNote, toggleShareNote } from '../redux/slices/notesSlice.js';
import { fetchStudyPlan, toggleDailyGoal } from '../redux/slices/plannerSlice.js';
import NoteCard from '../components/notes/NoteCard.jsx';
import ExplainModal from '../components/ai/ExplainModal.jsx';
import OnboardingGuideModal from '../components/common/OnboardingGuideModal.jsx';
import {
  Plus,
  ArrowRight,
  Check,
  HelpCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, stats } = useSelector((state) => state.auth);
  const { notes } = useSelector((state) => state.notes);
  const { plan } = useSelector((state) => state.planner);

  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchNotes());
    dispatch(fetchStudyPlan());

    // Auto-launch guide if arriving from registration
    if (location.state?.showGuide) {
      setGuideModalOpen(true);
    }
  }, [dispatch, location.state]);

  const handleDownload = (noteId) => {
    window.open(`/api/notes/${noteId}/download`, '_blank');
  };

  const handleGoalToggle = (goalId) => {
    dispatch(toggleDailyGoal(goalId));
  };

  const recentNotes = notes.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Student Welcome Header Block (Swiss Typographic Grid) */}
      <div className="border border-black bg-white p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest">
                SYS // ACTIVE SESSION
              </span>
              <span className="font-mono text-xs text-zinc-500 uppercase">
                [{stats?.studyStreak || user?.studyStreak || 1} DAYS STREAK]
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tightest text-black">
              {user?.name || 'STUDENT'}
            </h1>
            <p className="font-mono text-xs uppercase text-zinc-600">
              COURSE: {user?.course || 'GENERAL STUDIES'} // {user?.semester || 'SEMESTER 1'}
              {user?.subjects && user.subjects.length > 0 && ` // SUBJECTS: ${user.subjects.join(', ')}`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono">
            <Link
              to="/notes/upload"
              className="px-5 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-swiss-red transition-colors flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Intake New Notes</span>
            </Link>
            <button
              onClick={() => setGuideModalOpen(true)}
              className="px-4 py-3 border border-black bg-zinc-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-swiss-red" />
              <span>How It Works Guide</span>
            </button>
            <button
              onClick={() => setExplainModalOpen(true)}
              className="px-4 py-3 border border-black bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors"
            >
              Explain Text
            </button>
          </div>
        </div>

        {/* 4-Column Mathematical Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black pt-6">
          <div className="p-4 sm:px-6 sm:py-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">01 / TOTAL NOTES</span>
            <p className="text-3xl sm:text-4xl font-black text-black mt-1 tracking-tightest">
              {stats?.notesCount || notes.length || 0}
            </p>
            <span className="font-mono text-[10px] text-zinc-400 uppercase mt-0.5 block">Stored digital units</span>
          </div>

          <div className="p-4 sm:px-6 sm:py-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">02 / EXAMS ATTEMPTED</span>
            <p className="text-3xl sm:text-4xl font-black text-black mt-1 tracking-tightest">
              {stats?.totalQuizzesTaken || 0}
            </p>
            <span className="font-mono text-[10px] text-zinc-400 uppercase mt-0.5 block">Completed evaluations</span>
          </div>

          <div className="p-4 sm:px-6 sm:py-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">03 / AVERAGE SCORE</span>
            <p className="text-3xl sm:text-4xl font-black text-swiss-red mt-1 tracking-tightest">
              {stats?.avgScore || 0}%
            </p>
            <span className="font-mono text-[10px] text-zinc-400 uppercase mt-0.5 block">Overall accuracy rubric</span>
          </div>

          <div className="p-4 sm:px-6 sm:py-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">04 / CARDS MASTERED</span>
            <p className="text-3xl sm:text-4xl font-black text-black mt-1 tracking-tightest">
              {stats?.masteredFlashcards || 0}
              <span className="text-sm font-mono font-normal text-zinc-400"> / {stats?.totalFlashcards || 0}</span>
            </p>
            <span className="font-mono text-[10px] text-zinc-400 uppercase mt-0.5 block">Active recall retention</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Notes Registry on Left, Action Tasks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Notes Registry */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-baseline justify-between border-b border-black pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-swiss-red uppercase">01</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-black">
                Recent Study Notes
              </h2>
            </div>
            <Link
              to="/notes"
              className="font-mono text-xs font-bold uppercase text-black hover:underline flex items-center gap-1"
            >
              <span>View All ({notes.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {notes.length === 0 ? (
            <div className="border border-black bg-white p-12 text-center space-y-4">
              <h3 className="font-mono font-bold uppercase text-black text-base">No notes cataloged yet</h3>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto font-sans">
                Upload handwritten materials or lecture PDFs to populate your digital notes library.
              </p>
              <Link
                to="/notes/upload"
                className="inline-block px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase hover:bg-swiss-red transition-colors"
              >
                Intake First Note
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={(id) => dispatch(deleteNote(id))}
                  onShareToggle={(id) => dispatch(toggleShareNote(id))}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Today's Study Targets & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Goals Block */}
          <div className="border border-black bg-white p-5 space-y-4">
            <div className="flex items-baseline justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-swiss-red uppercase">02</span>
                <h3 className="text-base font-black uppercase tracking-tight text-black">
                  Daily Targets
                </h3>
              </div>
              <Link to="/planner" className="font-mono text-[11px] font-bold uppercase hover:underline">
                Roadmap →
              </Link>
            </div>

            {plan?.dailyGoals && plan.dailyGoals.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {plan.dailyGoals.slice(0, 4).map((goal) => (
                  <div
                    key={goal._id}
                    onClick={() => handleGoalToggle(goal._id)}
                    className="flex items-start gap-2.5 p-2 border border-zinc-200 hover:border-black cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-4 h-4 border border-black flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        goal.completed ? 'bg-black text-white' : 'bg-white'
                      }`}
                    >
                      {goal.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="leading-snug">
                      <span className={goal.completed ? 'line-through text-zinc-400' : 'text-black font-bold'}>
                        {goal.text}
                      </span>
                      <span className="text-[10px] text-zinc-400 block uppercase mt-0.5">{goal.subject}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-400 py-4 text-center">No targets defined for today.</p>
            )}

            <Link
              to="/planner"
              className="block w-full py-2.5 text-center bg-zinc-100 hover:bg-black hover:text-white text-xs font-mono font-bold uppercase transition-colors"
            >
              Open Curriculum Planner
            </Link>
          </div>

          {/* Quick Execution Modules */}
          <div className="border border-black bg-white p-5 space-y-3 font-mono">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block border-b border-black pb-1 mb-2">
              QUICK COMMANDS
            </span>

            <Link
              to="/ai-learning?tab=explain"
              className="flex items-center justify-between p-3 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-colors text-xs font-bold uppercase"
            >
              <span>Explain Any Concept</span>
              <span>→</span>
            </Link>

            <Link
              to="/ai-learning?tab=ask"
              className="flex items-center justify-between p-3 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-colors text-xs font-bold uppercase"
            >
              <span>Grounded Note Query</span>
              <span>→</span>
            </Link>

            <Link
              to="/ai-learning?tab=questions"
              className="flex items-center justify-between p-3 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-colors text-xs font-bold uppercase"
            >
              <span>Synthesize Exam Drill</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Explain Modal */}
      <ExplainModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
      />

      {/* Onboarding Walkthrough Guide Modal */}
      <OnboardingGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
}

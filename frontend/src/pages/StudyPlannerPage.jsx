import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudyPlan,
  updatePlanSettings,
  generateSchedule,
  addDailyGoal,
  toggleDailyGoal,
  deleteDailyGoal,
} from '../redux/slices/plannerSlice.js';
import {
  Trash2,
  Check,
} from 'lucide-react';

export default function StudyPlannerPage() {
  const dispatch = useDispatch();
  const { plan, generating } = useSelector((state) => state.planner);
  const { user } = useSelector((state) => state.auth);

  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState(3);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalSubject, setNewGoalSubject] = useState('');
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchStudyPlan());
  }, [dispatch]);

  useEffect(() => {
    if (plan?.targetExamDate) {
      setExamDate(new Date(plan.targetExamDate).toISOString().split('T')[0]);
      setDailyHours(plan.availableHoursPerDay || 3);
    }
  }, [plan]);

  const daysUntilExam = plan?.targetExamDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(plan.targetExamDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      )
    : 30;

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!examDate) return;
    await dispatch(
      updatePlanSettings({
        targetExamDate: examDate,
        availableHoursPerDay: dailyHours,
      })
    );
    setIsEditingSettings(false);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    dispatch(
      addDailyGoal({
        text: newGoalText.trim(),
        subject: newGoalSubject || user?.subjects?.[0] || 'General',
      })
    );
    setNewGoalText('');
  };

  const handleGenerateSchedule = () => {
    dispatch(generateSchedule(7));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black pb-4">
        <div>
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
            TIMELINE ARCHITECTURE // 07
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1 font-sans">
            Semester Study Planner
          </h1>
          <p className="text-xs text-zinc-500 uppercase mt-0.5">
            Algorithmic Milestone Cadence & Daily Revision Targets
          </p>
        </div>

        <button
          onClick={handleGenerateSchedule}
          disabled={generating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-swiss-red text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          <span>{generating ? '[ SYNTHESIZING ROADMAP... ]' : 'SYNTHESIZE 7-DAY ROADMAP'}</span>
        </button>
      </div>

      {/* Countdown & Configuration Strip */}
      <div className="border border-black bg-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 border-2 border-black bg-black text-white flex flex-col items-center justify-center">
              <span className="text-3xl font-black leading-none">{daysUntilExam}</span>
              <span className="text-[9px] uppercase font-bold tracking-widest mt-1">DAYS</span>
            </div>
            <div>
              <span className="text-xs font-bold text-swiss-red uppercase tracking-wider block">
                DEADLINE COUNTDOWN
              </span>
              <h2 className="text-2xl font-black uppercase text-black font-sans mt-0.5">{plan?.title || 'SEMESTER EXAMINATION'}</h2>
              <p className="text-xs text-zinc-500 uppercase">
                TARGET DATE: {plan?.targetExamDate ? new Date(plan.targetExamDate).toISOString().split('T')[0] : 'NOT SET'} • CADENCE: {dailyHours} HOURS / DAY
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className="px-4 py-2 border border-black bg-white hover:bg-zinc-100 text-xs font-bold uppercase"
          >
            {isEditingSettings ? 'CLOSE CONFIG' : 'CONFIGURE SCHEDULE'}
          </button>
        </div>

        {/* Edit Settings Form */}
        {isEditingSettings && (
          <form onSubmit={handleSaveSettings} className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 border border-black uppercase focus:outline-none bg-zinc-50"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Daily Study Capacity (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={14}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-black uppercase focus:outline-none bg-zinc-50"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-swiss-red text-white font-bold uppercase transition-colors"
              >
                SAVE TIMELINE PARAMS
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Main Grid: Goals & Milestone Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Daily Target Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-black bg-white p-6 space-y-4">
            <div className="flex items-baseline justify-between border-b border-black pb-2">
              <span className="text-xs font-bold uppercase text-black">
                // DAILY TARGET CHECKLIST
              </span>
              <span className="text-[11px] font-bold text-emerald-600 uppercase">
                {plan?.dailyGoals?.filter((g) => g.completed).length || 0} / {plan?.dailyGoals?.length || 0} COMPLETED
              </span>
            </div>

            {/* Add Goal Input */}
            <form onSubmit={handleAddGoal} className="space-y-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="ADD REVISION TARGET..."
                className="w-full px-3 py-2 border border-black text-xs uppercase focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoalSubject}
                  onChange={(e) => setNewGoalSubject(e.target.value)}
                  placeholder="SUBJECT..."
                  className="w-full px-3 py-1.5 border border-black text-xs uppercase focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newGoalText.trim()}
                  className="px-4 py-1.5 bg-black hover:bg-swiss-red text-white font-bold text-xs uppercase flex-shrink-0 disabled:opacity-50"
                >
                  ADD
                </button>
              </div>
            </form>

            {/* Goals List */}
            <div className="space-y-2 pt-2 text-xs">
              {plan?.dailyGoals && plan.dailyGoals.length > 0 ? (
                plan.dailyGoals.map((goal) => (
                  <div
                    key={goal._id}
                    className="flex items-start justify-between gap-2 p-2.5 border border-zinc-200 hover:border-black transition-colors"
                  >
                    <div
                      onClick={() => dispatch(toggleDailyGoal(goal._id))}
                      className="flex items-start gap-2.5 cursor-pointer flex-1"
                    >
                      <div
                        className={`w-4 h-4 border border-black flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          goal.completed ? 'bg-black text-white' : 'bg-white'
                        }`}
                      >
                        {goal.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <p className={goal.completed ? 'line-through text-zinc-400' : 'text-black font-bold uppercase'}>
                          {goal.text}
                        </p>
                        <span className="text-[10px] text-zinc-400 block uppercase mt-0.5">{goal.subject}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => dispatch(deleteDailyGoal(goal._id))}
                      className="p-1 text-zinc-400 hover:text-swiss-red"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-zinc-400 uppercase text-xs">No active targets defined.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Milestone Roadmap */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-black bg-white p-6 space-y-4">
            <div className="flex items-baseline justify-between border-b border-black pb-2">
              <span className="text-xs font-bold uppercase text-black">
                // 7-DAY MILESTONE SCHEDULE
              </span>
              <span className="text-[11px] text-zinc-400 uppercase">STANDARDS CADENCE</span>
            </div>

            {plan?.generatedSchedule && plan.generatedSchedule.length > 0 ? (
              <div className="space-y-4">
                {plan.generatedSchedule.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-black bg-zinc-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black uppercase">DAY {milestone.dayNumber}</span>
                        <span className="text-zinc-400">///</span>
                        <span className="font-black uppercase text-black">{milestone.focusSubject}</span>
                      </div>
                      <span className="font-bold uppercase text-zinc-500">
                        {milestone.studyHours} HOURS
                      </span>
                    </div>

                    {/* Topics */}
                    <div className="space-y-1 font-sans text-xs text-zinc-700">
                      {milestone.topics?.map((topic, tIdx) => (
                        <p key={tIdx}>• {topic}</p>
                      ))}
                    </div>

                    {/* Check items */}
                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                      {milestone.revisionChecklist?.map((chk, cIdx) => (
                        <span key={cIdx} className="px-1.5 py-0.5 border border-zinc-300 bg-white uppercase">
                          ✓ {chk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <h4 className="font-bold uppercase text-black text-sm">No roadmap generated yet</h4>
                <p className="text-xs text-zinc-500 font-sans max-w-sm mx-auto">
                  Click the button above to generate a day-by-day milestone syllabus plan.
                </p>
                <button
                  onClick={handleGenerateSchedule}
                  disabled={generating}
                  className="px-6 py-2.5 bg-black hover:bg-swiss-red text-white text-xs font-bold uppercase transition-colors"
                >
                  Generate Roadmap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

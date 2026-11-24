import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuizzes,
  fetchQuizById,
  submitQuizAttempt,
  fetchQuizAttempts,
  deleteQuiz,
  clearAttemptResult,
} from '../redux/slices/quizSlice.js';
import confetti from 'canvas-confetti';
import {
  Plus,
  Trash2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export default function PracticeQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizzes, currentQuiz, attemptResult, attempts, submitting } =
    useSelector((state) => state.quizzes);

  const [studentAnswers, setStudentAnswers] = useState({});
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'runner' | 'attempts'

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchQuizAttempts());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizById(id));
      setActiveTab('runner');
      setStudentAnswers({});
      dispatch(clearAttemptResult());
    } else {
      setActiveTab('list');
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (attemptResult?.summary?.percentage >= 75) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // fallback
      }
    }
  }, [attemptResult]);

  const handleSelectOption = (questionIndex, option) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleWrittenAnswerChange = (questionIndex, text) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionIndex]: text,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    const formattedAnswers = currentQuiz.questions.map((_, idx) => ({
      questionIndex: idx,
      answer: studentAnswers[idx] || '',
    }));

    await dispatch(
      submitQuizAttempt({
        quizId: currentQuiz._id,
        studentAnswers: formattedAnswers,
      })
    );
  };

  const handleDeleteQuiz = (quizId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this quiz record?')) {
      dispatch(deleteQuiz(quizId));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black pb-4">
        <div>
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
            EVALUATION TERMINAL // 05
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1 font-sans">
            Practice & Multi-Point Assessment
          </h1>
          <p className="text-xs text-zinc-500 uppercase mt-0.5">
            Objective Auto-Grading & AI Written Answer Evaluation
          </p>
        </div>

        <Link
          to="/ai-learning?tab=questions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase hover:bg-swiss-red transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Synthesize Quiz</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black text-xs font-bold uppercase">
        <button
          onClick={() => {
            navigate('/practice');
            setActiveTab('list');
          }}
          className={`py-3 px-6 border-b-2 transition-colors ${
            activeTab === 'list' && !id
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ Available Exams ({quizzes.length}) ]
        </button>

        {id && (
          <button
            onClick={() => setActiveTab('runner')}
            className={`py-3 px-6 border-b-2 transition-colors ${
              activeTab === 'runner'
                ? 'border-black bg-white text-black'
                : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            [ Active Test Terminal ]
          </button>
        )}

        <button
          onClick={() => {
            navigate('/practice');
            setActiveTab('attempts');
          }}
          className={`py-3 px-6 border-b-2 transition-colors ${
            activeTab === 'attempts'
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ Evaluation Log ({attempts.length}) ]
        </button>
      </div>

      {/* VIEW 1: ACTIVE QUIZ RUNNER OR RESULTS */}
      {id && currentQuiz && (
        <div className="space-y-6">
          {attemptResult ? (
            /* Result Evaluation View (Swiss Style) */
            <div className="border border-black bg-white p-6 sm:p-10 space-y-8">
              {/* Score Header */}
              <div className="border-b-2 border-black pb-6 space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-black text-white uppercase tracking-wider">
                  EVALUATION COMPLETE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black font-sans">
                  {currentQuiz.title}
                </h2>
                <div className="flex items-baseline gap-4 pt-2">
                  <div className="text-5xl font-black text-swiss-red tracking-tightest">
                    {attemptResult.summary?.percentage}%
                  </div>
                  <div className="text-sm font-bold text-zinc-500 uppercase">
                    MARKS AWARDED: {attemptResult.summary?.totalScore} / {attemptResult.summary?.maxScore}
                  </div>
                </div>
                <p className="text-xs text-zinc-700 font-sans leading-relaxed border-l-2 border-black pl-3 py-1">
                  {attemptResult.summary?.feedbackSummary}
                </p>
                <div className="pt-2 flex gap-3 text-xs">
                  <button
                    onClick={() => {
                      dispatch(clearAttemptResult());
                      setStudentAnswers({});
                    }}
                    className="px-4 py-2 border border-black hover:bg-black hover:text-white uppercase font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Drill</span>
                  </button>
                  <Link
                    to="/practice"
                    className="px-4 py-2 bg-black text-white uppercase font-bold hover:bg-swiss-red transition-colors"
                  >
                    All Exams
                  </Link>
                </div>
              </div>

              {/* Detailed Question Evaluations */}
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-black block">
                  // CRITERIA BREAKDOWN & RUBRIC FEEDBACK
                </span>

                {attemptResult.attempt?.answers?.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-5 border-2 text-xs font-sans ${
                      ans.isCorrect ? 'border-black bg-zinc-50' : 'border-swiss-red bg-red-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-black pb-2 mb-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black uppercase">QUESTION {idx + 1}</span>
                        <span className="text-[10px] px-1.5 py-0.5 border border-black uppercase bg-white">
                          {ans.type}
                        </span>
                      </div>
                      <span className="font-bold uppercase text-black">
                        {ans.aiMarks} / {ans.maxMarks} MARKS
                      </span>
                    </div>

                    <p className="font-bold text-black text-sm mb-3 uppercase font-sans">{ans.questionText}</p>

                    <div className="space-y-1 text-xs">
                      <p className="text-zinc-700">
                        <strong className="font-mono uppercase text-zinc-400">STUDENT INPUT:</strong> {ans.studentAnswer}
                      </p>
                      <p className="text-zinc-700">
                        <strong className="font-mono uppercase text-zinc-400">MODEL ANSWER:</strong> {ans.correctAnswer}
                      </p>
                    </div>

                    {ans.feedback && (
                      <div className="mt-3 p-3 border-l-2 border-black bg-white text-xs font-mono text-zinc-800 space-y-1">
                        <span className="font-bold text-black uppercase block">AI EXAMINER CRITIQUE:</span>
                        <p className="font-sans text-xs">{ans.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Taking Quiz Form */
            <div className="border border-black bg-white p-6 sm:p-10 space-y-8">
              <div className="border-b-2 border-black pb-4">
                <span className="text-xs font-bold text-swiss-red uppercase tracking-wider block">
                  {currentQuiz.subject} /// DIFFICULTY: {currentQuiz.difficulty.toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black mt-1 font-sans">
                  {currentQuiz.title}
                </h2>
                <p className="text-xs text-zinc-500 uppercase mt-0.5">
                  ANSWER ALL SECTIONS BEFORE PROCEEDING TO EVALUATION.
                </p>
              </div>

              <div className="space-y-6">
                {currentQuiz.questions.map((q, idx) => (
                  <div key={idx} className="p-6 border border-black bg-zinc-50/50 space-y-4 text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <span className="font-bold uppercase text-black">
                        QUESTION {idx + 1} OF {currentQuiz.questions.length}
                      </span>
                      <span className="text-zinc-500 uppercase">
                        WEIGHT: {q.points || 1} MARKS
                      </span>
                    </div>

                    <h4 className="font-bold text-black text-sm uppercase leading-snug font-sans">
                      {q.question}
                    </h4>

                    {/* MCQ Options */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {q.options?.map((opt, optIdx) => {
                          const isSelected = studentAnswers[idx] === opt;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(idx, opt)}
                              className={`p-3 border text-left text-xs font-mono uppercase transition-colors ${
                                isSelected
                                  ? 'bg-black text-white border-black font-bold'
                                  : 'bg-white hover:bg-zinc-100 text-black border-black'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 border flex items-center justify-center font-bold text-[10px] ${isSelected ? 'border-white bg-white text-black' : 'border-black'}`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* True / False */}
                    {q.type === 'true_false' && (
                      <div className="flex gap-4 pt-2">
                        {['True', 'False'].map((tf) => {
                          const isSelected = studentAnswers[idx] === tf;
                          return (
                            <button
                              key={tf}
                              type="button"
                              onClick={() => handleSelectOption(idx, tf)}
                              className={`flex-1 py-3 border text-xs font-bold uppercase transition-colors ${
                                isSelected
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white hover:bg-zinc-100 text-black border-black'
                              }`}
                            >
                              {tf}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Written Short Answer */}
                    {q.type === 'short' && (
                      <div className="space-y-1 pt-2">
                        <label className="block text-[11px] font-bold uppercase text-zinc-500">
                          Written Response (Evaluated on precision & keywords):
                        </label>
                        <textarea
                          rows={3}
                          value={studentAnswers[idx] || ''}
                          onChange={(e) => handleWrittenAnswerChange(idx, e.target.value)}
                          placeholder="STATE MECHANISM, DEFINITION, AND KEY EQUATIONS..."
                          className="w-full p-3 border border-black text-xs font-mono uppercase focus:outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="px-8 py-4 bg-black hover:bg-swiss-red text-white font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <span>[ GRADING & EVALUATING WITH AI... ]</span>
                  ) : (
                    <span>SUBMIT DRILL FOR MULTI-POINT EVALUATION</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: QUIZZES LIST */}
      {activeTab === 'list' && !id && (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="border border-black bg-white p-16 text-center max-w-md mx-auto space-y-4">
              <h3 className="font-bold text-black uppercase text-base">No practice exams cataloged</h3>
              <p className="text-xs text-zinc-500 font-sans">
                Generate exams from notes to practice active recall and written responses.
              </p>
              <Link
                to="/ai-learning?tab=questions"
                className="inline-block px-6 py-3 bg-black text-white text-xs font-bold uppercase hover:bg-swiss-red transition-colors"
              >
                Synthesize First Exam
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  onClick={() => navigate(`/practice/${quiz._id}`)}
                  className="border border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col justify-between cursor-pointer transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-black text-white uppercase">
                        {quiz.subject}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-zinc-500">
                        {quiz.difficulty}
                      </span>
                    </div>

                    <h3 className="font-black uppercase text-black text-base group-hover:text-swiss-red transition-colors line-clamp-2 font-sans">
                      {quiz.title}
                    </h3>

                    <p className="text-xs text-zinc-500 uppercase">
                      {quiz.questions?.length || 0} QUESTIONS • {quiz.questionType.toUpperCase()}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black flex items-center justify-between text-xs">
                    <span className="font-bold uppercase text-black group-hover:underline flex items-center gap-1">
                      <span>Begin Exam</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      onClick={(e) => handleDeleteQuiz(quiz._id, e)}
                      className="p-1 text-zinc-400 hover:text-swiss-red"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: ATTEMPT HISTORY */}
      {activeTab === 'attempts' && (
        <div className="border border-black bg-white">
          <div className="p-5 border-b border-black">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              // HISTORICAL EVALUATION LOGS
            </span>
          </div>

          {attempts.length === 0 ? (
            <p className="p-8 text-center text-xs text-zinc-400 uppercase">No completed exams recorded.</p>
          ) : (
            <div className="divide-y divide-black text-xs font-mono">
              {attempts.map((att) => (
                <div key={att._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50">
                  <div className="space-y-1">
                    <h4 className="font-bold text-black uppercase text-sm font-sans">{att.quiz?.title || 'Exam Drill'}</h4>
                    <p className="text-zinc-500 uppercase text-[11px]">
                      TIMESTAMP: {new Date(att.completedAt).toISOString().split('T')[0]} • {att.answers?.length} QUESTIONS EVALUATED
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-black">{att.percentage}%</span>
                    <p className="text-[11px] text-zinc-400 uppercase">
                      {att.totalScore} / {att.maxScore} MARKS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

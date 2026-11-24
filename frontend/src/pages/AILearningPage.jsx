import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../redux/slices/notesSlice.js';
import { generateQuizFromNote } from '../redux/slices/quizSlice.js';
import { generateDeckFromNote } from '../redux/slices/flashcardSlice.js';
import AskNotesChat from '../components/ai/AskNotesChat.jsx';
import api from '../services/api';
import {
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

export default function AILearningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notes } = useSelector((state) => state.notes);
  const activeTabParam = searchParams.get('tab') || 'explain';
  const initialNoteId = searchParams.get('noteId') || '';

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [selectedNoteId, setSelectedNoteId] = useState(initialNoteId);

  // Explain State
  const [explainInput, setExplainInput] = useState('');
  const [explanationResult, setExplanationResult] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Question Generator State
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('all');
  const [quizGenerating, setQuizGenerating] = useState(false);
  const [generatedQuizId, setGeneratedQuizId] = useState(null);

  // Flashcards Generator State
  const [cardCount, setCardCount] = useState(6);
  const [flashcardGenerating, setFlashcardGenerating] = useState(false);
  const [generatedDeckId, setGeneratedDeckId] = useState(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab, ...(selectedNoteId ? { noteId: selectedNoteId } : {}) });
  };

  const selectedNote = notes.find((n) => n._id === selectedNoteId);

  // Run Explain This
  const handleRunExplain = async () => {
    if (!explainInput.trim()) return;
    setExplainLoading(true);
    try {
      const res = await api.post('/ai/explain', {
        text: explainInput,
        noteId: selectedNoteId || null,
      });
      setExplanationResult(res.data.explanation);
    } catch (err) {
      console.error(err);
      setExplanationResult('ERROR: Explanation execution failed.');
    } finally {
      setExplainLoading(false);
    }
  };

  // Run Question Generator
  const handleGenerateQuestions = async () => {
    if (!selectedNote && !explainInput) {
      alert('Please select a note or enter content to generate questions.');
      return;
    }
    setQuizGenerating(true);
    try {
      const payload = {
        noteId: selectedNote?._id || null,
        content: selectedNote ? selectedNote.structuredContent : explainInput,
        count: questionCount,
        difficulty,
        questionType,
        saveAsQuiz: true,
        title: selectedNote ? `Quiz: ${selectedNote.title}` : 'AI Generated Practice Quiz',
      };
      const res = await dispatch(generateQuizFromNote(payload));
      if (!res.error && res.payload?.quiz?._id) {
        setGeneratedQuizId(res.payload.quiz._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuizGenerating(false);
    }
  };

  // Run Flashcard Generator
  const handleGenerateFlashcards = async () => {
    if (!selectedNote && !explainInput) {
      alert('Please select a note or enter content to generate flashcards.');
      return;
    }
    setFlashcardGenerating(true);
    try {
      const payload = {
        noteId: selectedNote?._id || null,
        content: selectedNote ? selectedNote.structuredContent : explainInput,
        count: cardCount,
        title: selectedNote ? `Deck: ${selectedNote.title}` : 'AI Revision Deck',
        saveAsDeck: true,
      };
      const res = await dispatch(generateDeckFromNote(payload));
      if (!res.error && res.payload?.deck?._id) {
        setGeneratedDeckId(res.payload.deck._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFlashcardGenerating(false);
    }
  };

  const copyExplanation = () => {
    navigator.clipboard.writeText(explanationResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Page Header */}
      <div className="border-b border-black pb-4">
        <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
          CENTRAL TUTOR ENGINE // 04
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1 font-sans">
          Cognitive AI Workspace
        </h1>
        <p className="text-xs text-zinc-500 uppercase mt-0.5">
          Concept Decomposition, In-Context Retrieval & Exam Synthesis
        </p>
      </div>

      {/* Note Selector Context Bar */}
      <div className="border border-black bg-white p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-black uppercase tracking-wider">
          ACTIVE STUDY DOCUMENT CONTEXT:
        </span>
        <select
          value={selectedNoteId}
          onChange={(e) => {
            setSelectedNoteId(e.target.value);
            setSearchParams({ tab: activeTab, ...(e.target.value ? { noteId: e.target.value } : {}) });
          }}
          className="w-full sm:w-96 px-3 py-2 border border-black text-xs font-bold uppercase bg-zinc-50 focus:outline-none"
        >
          <option value="">-- CHOOSE SAVED STUDY NOTE --</option>
          {notes.map((n) => (
            <option key={n._id} value={n._id}>
              {n.title.toUpperCase()} ({n.subject.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Tabs (Swiss Grid Tabs) */}
      <div className="flex border-b border-black text-xs font-bold uppercase overflow-x-auto">
        <button
          onClick={() => handleTabChange('explain')}
          className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'explain'
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ 01 / Concept Explainer ]
        </button>

        <button
          onClick={() => handleTabChange('ask')}
          className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'ask'
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ 02 / Ask Your Notes ]
        </button>

        <button
          onClick={() => handleTabChange('questions')}
          className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'questions'
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ 03 / Exam Question Generator ]
        </button>

        <button
          onClick={() => handleTabChange('flashcards')}
          className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'flashcards'
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ 04 / Flashcard Generator ]
        </button>
      </div>

      {/* Tab 1: Explain This */}
      {activeTab === 'explain' && (
        <div className="space-y-6">
          <div className="border border-black bg-white p-6 sm:p-8 space-y-4">
            <h3 className="font-sans font-bold text-black uppercase text-lg">Input Study Concept</h3>
            <p className="text-xs text-zinc-600 font-sans leading-relaxed">
              Deconstructs difficult syllabus concepts into intuitive analogies, identifies exam pitfalls, and provides practical application examples.
            </p>

            <textarea
              rows={4}
              value={explainInput}
              onChange={(e) => setExplainInput(e.target.value)}
              placeholder={
                selectedNote
                  ? `Enter term or paragraph from "${selectedNote.title}"...`
                  : 'PASTE THEOREM, FORMULA, OR COMPLEX PARAGRAPH...'
              }
              className="w-full p-4 border border-black text-xs font-mono uppercase focus:outline-none focus:bg-zinc-50"
            />

            <div className="flex justify-end">
              <button
                onClick={handleRunExplain}
                disabled={explainLoading || !explainInput.trim()}
                className="px-8 py-3 bg-black hover:bg-swiss-red text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <span>{explainLoading ? '[ EXPLAINING... ]' : 'GENERATE EXAM EXPLANATION'}</span>
              </button>
            </div>
          </div>

          {explanationResult && (
            <div className="border border-black bg-white p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black">
                <span className="text-xs font-bold text-black uppercase tracking-wider">
                  // STRUCTURED EXPLANATION OUTPUT
                </span>
                <button
                  onClick={copyExplanation}
                  className="flex items-center gap-1 text-[11px] font-bold text-black border border-black px-2 py-0.5 hover:bg-black hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              <div className="prose prose-zinc max-w-none text-black font-sans whitespace-pre-wrap leading-relaxed text-xs">
                {explanationResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Ask Your Notes */}
      {activeTab === 'ask' && (
        <div>
          {selectedNote ? (
            <AskNotesChat
              noteId={selectedNote._id}
              directContent={selectedNote.structuredContent}
              noteTitle={selectedNote.title}
            />
          ) : (
            <div className="border border-black bg-white p-16 text-center space-y-3">
              <h3 className="font-bold uppercase text-black text-base">Select Note Context</h3>
              <p className="text-xs text-zinc-500 font-sans max-w-sm mx-auto">
                Choose a document from the selector bar above to initiate grounded retrieval Q&A.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Question Generator */}
      {activeTab === 'questions' && (
        <div className="border border-black bg-white p-6 sm:p-8 space-y-6 text-xs">
          <div>
            <h3 className="font-sans font-bold text-black uppercase text-lg">Synthesize Exam Drill</h3>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              Generates rigorous evaluation questions directly from source material
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 border border-black uppercase bg-white focus:outline-none"
              >
                <option value="all">ALL TYPES (MCQ, WRITTEN, T/F)</option>
                <option value="mcq">MULTIPLE CHOICE ONLY (MCQ)</option>
                <option value="short">WRITTEN SHORT ANSWER ONLY</option>
                <option value="true_false">TRUE / FALSE ONLY</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-black uppercase bg-white focus:outline-none"
              >
                <option value="easy">EASY (DEFINITIONS & DIRECT FACTS)</option>
                <option value="medium">MEDIUM (STANDARD UNIVERSITY EXAM)</option>
                <option value="hard">HARD (ANALYTICAL & DEEP MECHANISMS)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Question Volume
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-black uppercase bg-white focus:outline-none"
              >
                <option value={3}>03 QUESTIONS (RAPID CHECK)</option>
                <option value={5}>05 QUESTIONS (STANDARD TEST)</option>
                <option value={10}>10 QUESTIONS (COMPREHENSIVE)</option>
              </select>
            </div>
          </div>

          {!selectedNote && (
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Or Paste Study Material Directly:
              </label>
              <textarea
                rows={4}
                value={explainInput}
                onChange={(e) => setExplainInput(e.target.value)}
                placeholder="PASTE LECTURE TEXT..."
                className="w-full p-3 border border-black uppercase focus:outline-none"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleGenerateQuestions}
              disabled={quizGenerating || (!selectedNote && !explainInput.trim())}
              className="px-8 py-3 bg-black hover:bg-swiss-red text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{quizGenerating ? '[ SYNTHESIZING QUESTIONS... ]' : 'GENERATE EXAM TEST'}</span>
            </button>
          </div>

          {generatedQuizId && (
            <div className="p-4 border border-emerald-600 bg-emerald-50 text-emerald-900 flex items-center justify-between">
              <span className="font-bold uppercase">SUCCESS: Practice exam synthesized.</span>
              <button
                onClick={() => navigate(`/practice/${generatedQuizId}`)}
                className="px-4 py-2 bg-black text-white font-bold uppercase text-xs flex items-center gap-1.5"
              >
                <span>Launch Exam Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="border border-black bg-white p-6 sm:p-8 space-y-6 text-xs">
          <div>
            <h3 className="font-sans font-bold text-black uppercase text-lg">Synthesize Flashcards</h3>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              Extracts high-yield formulas and concepts into active-recall flashcard decks
            </p>
          </div>

          <div>
            <label className="block font-bold uppercase text-black mb-1">
              Deck Volume
            </label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-full sm:w-60 px-3 py-2 border border-black uppercase bg-white focus:outline-none"
            >
              <option value={4}>04 CARDS (CORE DEFINITIONS)</option>
              <option value={6}>06 CARDS (STANDARD DRILL)</option>
              <option value={10}>10 CARDS (COMPREHENSIVE)</option>
            </select>
          </div>

          {!selectedNote && (
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Or Paste Source Content Directly:
              </label>
              <textarea
                rows={4}
                value={explainInput}
                onChange={(e) => setExplainInput(e.target.value)}
                placeholder="PASTE LECTURE TEXT..."
                className="w-full p-3 border border-black uppercase focus:outline-none"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleGenerateFlashcards}
              disabled={flashcardGenerating || (!selectedNote && !explainInput.trim())}
              className="px-8 py-3 bg-black hover:bg-swiss-red text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{flashcardGenerating ? '[ EXTRACTING FLASHCARDS... ]' : 'GENERATE FLASHCARD DECK'}</span>
            </button>
          </div>

          {generatedDeckId && (
            <div className="p-4 border border-emerald-600 bg-emerald-50 text-emerald-900 flex items-center justify-between">
              <span className="font-bold uppercase">SUCCESS: Flashcard deck generated.</span>
              <button
                onClick={() => navigate(`/flashcards/${generatedDeckId}`)}
                className="px-4 py-2 bg-black text-white font-bold uppercase text-xs flex items-center gap-1.5"
              >
                <span>Open Deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

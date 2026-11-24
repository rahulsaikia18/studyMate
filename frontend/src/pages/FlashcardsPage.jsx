import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDecks,
  fetchDeckById,
  toggleCardMastery,
  deleteDeck,
} from '../redux/slices/flashcardSlice.js';
import FlashcardItem from '../components/flashcards/FlashcardItem.jsx';
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function FlashcardsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { decks, currentDeck } = useSelector((state) => state.flashcards);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchDecks());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchDeckById(id));
      setActiveCardIndex(0);
    }
  }, [id, dispatch]);

  const handleToggleMastery = (cardId) => {
    if (!currentDeck) return;
    dispatch(toggleCardMastery({ deckId: currentDeck._id, cardId }));
  };

  const handleDeleteDeck = (deckId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this flashcard deck?')) {
      dispatch(deleteDeck(deckId));
      if (id === deckId) {
        navigate('/flashcards');
      }
    }
  };

  const handleNext = () => {
    if (!currentDeck?.cards) return;
    setActiveCardIndex((prev) => (prev + 1) % currentDeck.cards.length);
  };

  const handlePrev = () => {
    if (!currentDeck?.cards) return;
    setActiveCardIndex((prev) => (prev - 1 + currentDeck.cards.length) % currentDeck.cards.length);
  };

  const masteredCount = currentDeck?.cards?.filter((c) => c.mastered).length || 0;
  const totalCount = currentDeck?.cards?.length || 0;
  const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black pb-4">
        <div>
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
            RETENTION ENGINE // 06
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1 font-sans">
            Active Recall Flashcards
          </h1>
          <p className="text-xs text-zinc-500 uppercase mt-0.5">
            Spaced Repetition for Formulae, Axioms & Terminology
          </p>
        </div>

        <Link
          to="/ai-learning?tab=flashcards"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase hover:bg-swiss-red transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Synthesize Deck</span>
        </Link>
      </div>

      {/* SINGLE DECK REVISION MODE */}
      {id && currentDeck ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black pb-4">
            <div>
              <Link to="/flashcards" className="text-xs font-bold uppercase text-zinc-500 hover:text-black">
                ← Return to Decks Directory
              </Link>
              <h2 className="text-2xl font-black uppercase text-black mt-1 font-sans">{currentDeck.title}</h2>
            </div>

            {/* Mastery Matrix */}
            <div className="text-right">
              <span className="text-xs font-bold uppercase text-black block">
                RETENTION: {masteredCount} / {totalCount} ({masteryPercentage}%)
              </span>
              <div className="w-48 h-2 border border-black bg-white mt-1">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${masteryPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {currentDeck.cards && currentDeck.cards.length > 0 ? (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-zinc-500">
                <span>CARD {activeCardIndex + 1} OF {currentDeck.cards.length}</span>
                <span>CLICK TO ROTATE</span>
              </div>

              {/* 3D Flashcard Item */}
              <FlashcardItem
                card={currentDeck.cards[activeCardIndex]}
                onToggleMastery={handleToggleMastery}
              />

              {/* Deck Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  onClick={handlePrev}
                  className="px-6 py-3 border border-black bg-white text-black font-bold text-xs uppercase flex items-center gap-2 hover:bg-zinc-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex gap-1.5 overflow-x-auto max-w-[200px] py-1">
                  {currentDeck.cards.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCardIndex(i)}
                      className={`w-3 h-3 border border-black transition-all ${
                        i === activeCardIndex
                          ? 'bg-black'
                          : c.mastered
                          ? 'bg-emerald-500'
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-black text-white font-bold text-xs uppercase flex items-center gap-2 hover:bg-swiss-red transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center py-12 text-zinc-500 text-xs uppercase">No cards in this deck.</p>
          )}
        </div>
      ) : (
        /* ALL DECKS LIST */
        <div className="space-y-4">
          {decks.length === 0 ? (
            <div className="border border-black bg-white p-16 text-center max-w-md mx-auto space-y-4">
              <h3 className="font-bold text-black uppercase text-base">No flashcard decks cataloged</h3>
              <p className="text-xs text-zinc-500 font-sans">
                Synthesize active-recall cards from your study notes to reinforce retention.
              </p>
              <Link
                to="/ai-learning?tab=flashcards"
                className="inline-block px-6 py-3 bg-black text-white text-xs font-bold uppercase hover:bg-swiss-red transition-colors"
              >
                Synthesize First Deck
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.map((deck) => {
                const mastered = deck.cards?.filter((c) => c.mastered).length || 0;
                const total = deck.cards?.length || 0;
                const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

                return (
                  <div
                    key={deck._id}
                    onClick={() => navigate(`/flashcards/${deck._id}`)}
                    className="border border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col justify-between cursor-pointer transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-black text-white uppercase">
                          {deck.subject}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">
                          {pct}% MASTERED
                        </span>
                      </div>

                      <h3 className="font-black uppercase text-black text-base group-hover:text-swiss-red transition-colors line-clamp-2 font-sans">
                        {deck.title}
                      </h3>

                      <p className="text-xs text-zinc-500 uppercase">
                        {total} CARDS • ACTIVE RETENTION
                      </p>

                      <div className="w-full h-1 border border-black bg-white">
                        <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-black flex items-center justify-between text-xs">
                      <span className="font-bold uppercase text-black group-hover:underline flex items-center gap-1">
                        <span>Launch Drill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <button
                        onClick={(e) => handleDeleteDeck(deck._id, e)}
                        className="p-1 text-zinc-400 hover:text-swiss-red"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

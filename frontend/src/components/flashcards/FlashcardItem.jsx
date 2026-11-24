import React, { useState } from 'react';
import { RotateCw, Check } from 'lucide-react';

export default function FlashcardItem({ card, onToggleMastery }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full h-80 perspective-1000 select-none font-mono">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full cursor-pointer transition-transform duration-500 transform-style-3d border-2 ${
          card.mastered ? 'border-emerald-600' : 'border-black'
        } ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 w-full h-full bg-white p-6 flex flex-col justify-between backface-hidden">
          <div className="flex items-center justify-between border-b border-black pb-3">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-black text-white uppercase tracking-wider">
              {card.category}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 font-bold">
              <RotateCw className="w-3 h-3" />
              FLIP TO REVEAL
            </span>
          </div>

          <div className="my-auto text-center px-4">
            <span className="text-[10px] font-bold text-swiss-red uppercase tracking-widest block mb-2">
              PROMPT // CONCEPT
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-black leading-snug uppercase tracking-tight font-sans">
              {card.front}
            </h4>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-black text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastery && onToggleMastery(card._id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-bold uppercase transition-colors ${
                card.mastered
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-black bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{card.mastered ? 'MASTERED' : 'MARK MASTERED'}</span>
            </button>

            <span className="text-[10px] text-zinc-400 uppercase">ACTIVE RECALL</span>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 w-full h-full bg-black text-white p-6 flex flex-col justify-between backface-hidden rotate-y-180">
          <div className="flex items-center justify-between border-b border-zinc-700 pb-3">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-black uppercase tracking-wider">
              ANSWER SPECIFICATION
            </span>
            <span className="text-[10px] text-zinc-400 uppercase flex items-center gap-1">
              <RotateCw className="w-3 h-3" />
              FLIP BACK
            </span>
          </div>

          <div className="my-auto text-center px-4 overflow-y-auto max-h-44">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
              EXPLANATION & FORMULA
            </span>
            <p className="text-sm sm:text-base text-zinc-100 leading-relaxed font-sans font-normal">
              {card.back}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-700 text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastery && onToggleMastery(card._id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-bold uppercase transition-colors ${
                card.mastered
                  ? 'border-emerald-400 bg-emerald-400 text-black'
                  : 'border-white bg-black text-white hover:bg-white hover:text-black'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{card.mastered ? 'MASTERED' : 'MARK MASTERED'}</span>
            </button>

            <span className="text-[10px] text-zinc-500 uppercase">STANDARDS MODEL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

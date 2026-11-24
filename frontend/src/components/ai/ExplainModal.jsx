import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import api from '../../services/api';

export default function ExplainModal({ isOpen, onClose, selectedText = '', noteId = null }) {
  const [inputText, setInputText] = useState(selectedText);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (selectedText) {
      setInputText(selectedText);
      handleExplain(selectedText);
    }
  }, [selectedText]);

  const handleExplain = async (textToExplain = inputText) => {
    if (!textToExplain || textToExplain.trim() === '') return;
    setLoading(true);
    try {
      const res = await api.post('/ai/explain', {
        text: textToExplain,
        noteId,
      });
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation('ERROR: Failed to generate explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!explanation) return;
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none animate-in fade-in font-mono">
      <div className="bg-white w-full max-w-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black flex items-center justify-between bg-zinc-100">
          <div>
            <span className="text-[10px] font-bold text-swiss-red uppercase tracking-widest block">
              AI ENGINE // 04
            </span>
            <h3 className="font-extrabold text-black text-sm uppercase">Explain Study Content</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
              Input Term, Theorem, or Paragraph
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="PASTE CONCEPT OR DEF HERE..."
              className="w-full text-xs font-mono rounded-none border border-black p-3 focus:outline-none focus:bg-zinc-50 resize-none uppercase"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleExplain()}
              disabled={loading || !inputText.trim()}
              className="px-6 py-2.5 bg-black hover:bg-swiss-red text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{loading ? '[ EXPLAINING... ]' : 'SYNTHESIZE EXPLANATION'}</span>
            </button>
          </div>

          {/* Explanation Output */}
          {explanation && (
            <div className="mt-4 p-6 bg-zinc-50 border border-black space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black">
                <span className="text-xs font-bold text-black uppercase tracking-wider">
                  // STUDYMATE EXPLANATION OUTPUT
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-[11px] font-bold text-black border border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors"
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

              <div className="prose prose-sm max-w-none text-zinc-900 font-sans space-y-3 whitespace-pre-wrap leading-relaxed text-xs">
                {explanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

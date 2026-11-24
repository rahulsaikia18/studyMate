import React, { useState } from 'react';
import { Send } from 'lucide-react';
import api from '../../services/api';

export default function AskNotesChat({ noteId, directContent = '', noteTitle = 'Selected Notes' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `SYSTEM ACTIVE. Ask any question strictly grounded in "${noteTitle}". Answers cite source content directly.`,
    },
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuery = query;
    setQuery('');
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        noteId,
        directContent,
        query: currentQuery,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.answer,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'ERROR: Query execution failed. Verify note content and retry.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-black flex flex-col h-[580px] font-mono text-xs overflow-hidden">
      {/* Terminal Header */}
      <div className="p-3.5 bg-zinc-100 border-b border-black flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-swiss-red uppercase tracking-widest block">
            STRICT GROUNDING ENGINE
          </span>
          <h4 className="font-extrabold uppercase text-black text-xs truncate max-w-[200px]">
            {noteTitle}
          </h4>
        </div>
        <span className="text-[9px] font-bold px-1.5 py-0.5 border border-black bg-white uppercase">
          ONLINE
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`space-y-1 ${
              m.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">
              {m.sender === 'user' ? '// STUDENT' : '// SYSTEM RESPONSE'}
            </span>
            <div
              className={`p-3 text-xs leading-relaxed inline-block max-w-[90%] font-sans text-left ${
                m.sender === 'user'
                  ? 'bg-black text-white font-mono'
                  : m.isError
                  ? 'bg-red-50 text-swiss-red border border-swiss-red'
                  : 'bg-zinc-50 border border-black text-black'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-zinc-500 font-mono text-xs uppercase animate-pulse">
            [ QUERYING GROUNDED PASSAGES... ]
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-black flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="TYPE NOTE QUERY..."
          className="flex-1 px-3 py-2 border border-black text-xs font-mono uppercase focus:outline-none focus:bg-zinc-50"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-black hover:bg-swiss-red text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          <span>RUN</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Trash2,
  Sparkles,
  Award,
  Globe,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

export default function NoteCard({ note, onDelete, onShareToggle, onDownload }) {
  return (
    <div className="bg-white border border-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-2 mb-3 border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black text-white uppercase tracking-wider">
              {note.subject}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-zinc-300 text-zinc-700 uppercase">
              {note.fileType || 'TEXT'}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {note.semester}
            </span>
          </div>

          <button
            onClick={() => onShareToggle && onShareToggle(note._id)}
            title={note.isShared ? 'Shared publicly with community' : 'Private to you'}
            className={`p-1 border text-[10px] font-mono font-bold flex items-center gap-1 transition-colors ${
              note.isShared
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-zinc-300 text-zinc-400 hover:border-black hover:text-black'
            }`}
          >
            {note.isShared ? <Globe className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3" />}
            <span className="hidden sm:inline uppercase">{note.isShared ? 'PUB' : 'PRIV'}</span>
          </button>
        </div>

        {/* Note Title */}
        <Link to={`/notes/${note._id}`} className="block group-hover:text-swiss-red transition-colors">
          <h3 className="font-extrabold text-black text-base uppercase tracking-tight leading-snug line-clamp-2 mb-2">
            {note.title}
          </h3>
        </Link>

        {/* Note Summary / Excerpt */}
        {note.summary ? (
          <p className="text-xs text-zinc-600 line-clamp-3 mb-3 leading-relaxed font-normal border-l-2 border-black pl-2.5 py-0.5">
            {note.summary.replace(/###|##|#|\*\*/g, '').slice(0, 160)}...
          </p>
        ) : (
          <p className="text-xs text-zinc-500 line-clamp-3 mb-3 leading-relaxed font-normal">
            {note.structuredContent.replace(/###|##|#|\*\*/g, '').slice(0, 140)}...
          </p>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 font-mono text-[10px]">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-1.5 py-0.5 bg-zinc-100 text-zinc-700 uppercase">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-2.5 bg-zinc-50 border-t border-black flex items-center justify-between text-xs font-mono">
        <span className="text-[10px] text-zinc-500">
          {new Date(note.createdAt).toISOString().split('T')[0]}
        </span>

        <div className="flex items-center gap-1">
          <Link
            to={`/ai-learning?noteId=${note._id}&tab=explain`}
            title="Explain This Note"
            className="p-1.5 text-black hover:bg-black hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/ai-learning?noteId=${note._id}&tab=questions`}
            title="Generate Exam Drill"
            className="p-1.5 text-black hover:bg-black hover:text-white transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onDownload && onDownload(note._id)}
            title="Export Markdown"
            className="p-1.5 text-black hover:bg-black hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(note._id)}
              title="Delete Record"
              className="p-1.5 text-zinc-400 hover:text-swiss-red hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

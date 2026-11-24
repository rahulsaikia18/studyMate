import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNoteById,
  updateNote,
  deleteNote,
  toggleShareNote,
} from '../redux/slices/notesSlice.js';
import ExplainModal from '../components/ai/ExplainModal.jsx';
import AskNotesChat from '../components/ai/AskNotesChat.jsx';
import {
  ArrowLeft,
  Download,
  Trash2,
  Globe,
  Lock,
} from 'lucide-react';

export default function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeNote: note, loading } = useSelector((state) => state.notes);
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showAskChat, setShowAskChat] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchNoteById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (note) {
      setEditedTitle(note.title);
      setEditedContent(note.structuredContent);
    }
  }, [note]);

  const handleMouseUp = () => {
    const selection = window.getSelection().toString().trim();
    if (selection && selection.length > 3) {
      setSelectedText(selection);
    }
  };

  const handleSave = async () => {
    if (!editedTitle || !editedContent) return;
    const res = await dispatch(
      updateNote({
        id,
        data: {
          title: editedTitle,
          structuredContent: editedContent,
        },
      })
    );
    if (!res.error) {
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this study note?')) {
      await dispatch(deleteNote(id));
      navigate('/notes');
    }
  };

  const handleDownload = () => {
    window.open(`/api/notes/${id}/download`, '_blank');
  };

  if (loading && !note) {
    return (
      <div className="py-24 text-center font-mono text-xs uppercase text-zinc-500">
        [ RETRIEVING DIGITAL RECORD... ]
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 font-mono text-xs">
        <h3 className="font-bold text-black uppercase text-base">Record not found</h3>
        <p className="text-zinc-500 font-sans">The note may have been deleted or moved.</p>
        <Link to="/notes" className="inline-block px-4 py-2 bg-black text-white uppercase">
          ← Return to Directory
        </Link>
      </div>
    );
  }

  const isOwner = note.user?.toString() === user?._id?.toString() || note.user?._id?.toString() === user?._id?.toString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Meta Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/notes"
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold px-2 py-0.5 bg-black text-white uppercase">
              {note.subject}
            </span>
            <span className="text-zinc-500 uppercase">{note.semester}</span>
            <span className="text-zinc-400">///</span>
            <span className="text-zinc-500 uppercase">LANG: {note.language.toUpperCase()}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap font-mono">
          {selectedText && (
            <button
              onClick={() => setExplainModalOpen(true)}
              className="px-3 py-1.5 bg-swiss-red text-white text-xs font-bold uppercase animate-pulse"
            >
              Explain Selection [AI]
            </button>
          )}

          <button
            onClick={() => setShowAskChat(!showAskChat)}
            className={`px-3 py-1.5 border border-black text-xs font-bold uppercase transition-colors ${
              showAskChat ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            {showAskChat ? 'Hide Ask Notes' : 'Ask Notes [AI]'}
          </button>

          {isOwner && (
            <>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold uppercase"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 border border-black bg-white text-black text-xs font-bold uppercase hover:bg-zinc-100"
                >
                  Edit Note
                </button>
              )}

              <button
                onClick={() => dispatch(toggleShareNote(note._id))}
                className="p-1.5 border border-black bg-white hover:bg-zinc-100 text-xs font-bold flex items-center gap-1 uppercase"
                title={note.isShared ? 'Shared publicly' : 'Private'}
              >
                {note.isShared ? <Globe className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{note.isShared ? 'PUB' : 'PRIV'}</span>
              </button>
            </>
          )}

          <button
            onClick={handleDownload}
            className="p-1.5 border border-black bg-white hover:bg-zinc-100 text-xs"
            title="Export Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-1.5 border border-black bg-white hover:bg-red-50 hover:text-swiss-red text-xs"
              title="Delete Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-mono font-bold uppercase">
          SUCCESS: Digital record updated successfully.
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Note Sheet */}
        <div className={showAskChat ? 'lg:col-span-8 space-y-6' : 'lg:col-span-12 max-w-4xl mx-auto w-full space-y-6'}>
          <div className="border border-black bg-white p-8 sm:p-12 space-y-8">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full text-2xl sm:text-4xl font-black uppercase border-b-2 border-black pb-2 focus:outline-none"
              />
            ) : (
              <div className="border-b-2 border-black pb-4">
                <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest block mb-1">
                  DOCUMENT RECORD
                </span>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                  {note.title}
                </h1>
              </div>
            )}

            {/* AI Summary Highlight */}
            {note.summary && !isEditing && (
              <div className="border-l-4 border-black bg-zinc-50 p-5 space-y-2 font-mono text-xs">
                <span className="font-bold text-black uppercase tracking-wider block">
                  // EXECUTIVE REVISION HIGHLIGHTS
                </span>
                <div className="text-zinc-700 whitespace-pre-wrap leading-relaxed font-sans">
                  {note.summary}
                </div>
              </div>
            )}

            {/* Note Body */}
            {isEditing ? (
              <div className="space-y-2">
                <label className="block font-mono text-xs font-bold uppercase text-black">
                  Structured Content (Markdown)
                </label>
                <textarea
                  rows={22}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-4 border border-black font-mono text-xs focus:outline-none"
                />
              </div>
            ) : (
              <div
                onMouseUp={handleMouseUp}
                className="prose prose-zinc max-w-none text-black whitespace-pre-wrap leading-relaxed font-sans text-sm select-text"
              >
                {note.structuredContent}
              </div>
            )}
          </div>

          {/* Quick Study Navigation Bar */}
          <div className="border border-black bg-zinc-50 p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-zinc-600 uppercase font-bold">SYNTHESIZE ACTIVE STUDY TOOLS:</span>
            <div className="flex items-center gap-2">
              <Link
                to={`/ai-learning?noteId=${note._id}&tab=questions`}
                className="px-4 py-2 bg-black text-white font-bold uppercase hover:bg-swiss-red transition-colors"
              >
                Generate Quiz Drill
              </Link>
              <Link
                to={`/ai-learning?noteId=${note._id}&tab=flashcards`}
                className="px-4 py-2 border border-black bg-white text-black font-bold uppercase hover:bg-zinc-100 transition-colors"
              >
                Create Flashcard Deck
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Ask Notes Grounded Terminal */}
        {showAskChat && (
          <div className="lg:col-span-4 sticky top-24">
            <AskNotesChat
              noteId={note._id}
              directContent={note.structuredContent}
              noteTitle={note.title}
            />
          </div>
        )}
      </div>

      {/* Floating Explain Modal */}
      <ExplainModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        selectedText={selectedText}
        noteId={note._id}
      />
    </div>
  );
}

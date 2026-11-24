import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import {
  Download,
  Copy,
  Eye,
  Check,
} from 'lucide-react';

export default function CommunityNotesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [cloningId, setCloningId] = useState(null);
  const [cloneSuccessId, setCloneSuccessId] = useState(null);

  const [previewNote, setPreviewNote] = useState(null);

  useEffect(() => {
    fetchSharedNotes();
  }, [search, subjectFilter, semesterFilter]);

  const fetchSharedNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/community', {
        params: {
          search,
          subject: subjectFilter,
          semester: semesterFilter,
        },
      });
      setNotes(res.data.notes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (noteId) => {
    window.open(`/api/notes/${noteId}/download`, '_blank');
  };

  const handleClone = async (noteId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCloningId(noteId);
    try {
      await api.post(`/community/${noteId}/clone`);
      setCloneSuccessId(noteId);
      setTimeout(() => setCloneSuccessId(null), 3000);
    } catch (e) {
      console.error(e);
      alert('Could not save note to library.');
    } finally {
      setCloningId(null);
    }
  };

  const uniqueSubjects = ['All', ...new Set(notes.map((n) => n.subject).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black pb-4">
        <div>
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
            PUBLIC ARCHIVE // 08
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1 font-sans">
            Community Notes Registry
          </h1>
          <p className="text-xs text-zinc-500 uppercase mt-0.5">
            Peer-Reviewed Course Material Across Departments ({notes.length} verified units)
          </p>
        </div>
      </div>

      {/* Search and Filter Tabletop */}
      <div className="border border-black bg-white p-4 text-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH COMMUNITY NOTES..."
            className="w-full px-3 py-2 border border-black uppercase text-xs focus:outline-none focus:bg-zinc-50"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">SUBJECT:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="py-1.5 px-2 border border-black bg-white uppercase font-bold text-xs focus:outline-none"
            >
              {uniqueSubjects.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">SEMESTER:</span>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="py-1.5 px-2 border border-black bg-white uppercase font-bold text-xs focus:outline-none"
            >
              <option value="All">ALL</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={`Semester ${s}`}>
                  SEM {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs uppercase text-zinc-400">
          [ ACCESSING COMMUNITY ARCHIVE... ]
        </div>
      ) : notes.length === 0 ? (
        <div className="border border-black bg-white p-16 text-center max-w-md mx-auto space-y-3">
          <h3 className="font-bold text-black uppercase text-base">No shared notes found</h3>
          <p className="text-xs text-zinc-500 font-sans">
            Be the first scholar to share lecture summaries with the community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="border border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-black text-white uppercase">
                    {note.subject}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase">
                    {note.semester}
                  </span>
                </div>

                <h3
                  onClick={() => setPreviewNote(note)}
                  className="font-black text-black uppercase text-base hover:text-swiss-red cursor-pointer transition-colors line-clamp-2 font-sans"
                >
                  {note.title}
                </h3>

                <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed font-sans font-normal">
                  {note.summary || note.structuredContent.slice(0, 150)}...
                </p>

                <div className="pt-2 text-[10px] text-zinc-500 uppercase border-t border-zinc-100">
                  AUTHOR: {note.user?.name || 'STUDENT SCHOLAR'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-black flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewNote(note)}
                  className="text-black font-bold uppercase hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(note._id)}
                    title="Download Note File"
                    className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleClone(note._id)}
                    disabled={cloningId === note._id}
                    className={`px-3 py-1.5 font-bold uppercase flex items-center gap-1 border transition-colors ${
                      cloneSuccessId === note._id
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-black bg-black text-white hover:bg-swiss-red'
                    }`}
                  >
                    {cloneSuccessId === note._id ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Save to Library</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none font-mono">
          <div className="bg-white w-full max-w-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-zinc-100 border-b border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-swiss-red uppercase tracking-wider block">
                  {previewNote.subject} /// {previewNote.semester}
                </span>
                <h3 className="font-black text-black text-lg uppercase font-sans mt-0.5">{previewNote.title}</h3>
              </div>
              <button
                onClick={() => setPreviewNote(null)}
                className="p-1.5 border border-black bg-white hover:bg-black hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {previewNote.summary && (
                <div className="p-4 border-l-4 border-black bg-zinc-50 text-zinc-800 leading-relaxed font-sans">
                  <strong className="block font-mono text-black uppercase mb-1">Executive Summary:</strong>
                  {previewNote.summary}
                </div>
              )}

              <div className="prose prose-sm max-w-none text-black font-sans whitespace-pre-wrap leading-relaxed">
                {previewNote.structuredContent}
              </div>
            </div>

            <div className="p-4 border-t border-black bg-zinc-50 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 uppercase">
                AUTHOR: {previewNote.user?.name || 'STUDENT'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(previewNote._id)}
                  className="px-4 py-2 border border-black bg-white text-black font-bold uppercase hover:bg-zinc-100"
                >
                  Download File
                </button>
                <button
                  onClick={() => handleClone(previewNote._id)}
                  className="px-4 py-2 bg-black text-white font-bold uppercase hover:bg-swiss-red"
                >
                  Save to My Library
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

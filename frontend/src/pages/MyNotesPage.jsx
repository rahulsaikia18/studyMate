import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote, toggleShareNote } from '../redux/slices/notesSlice.js';
import NoteCard from '../components/notes/NoteCard.jsx';
import {
  Search,
  Plus,
} from 'lucide-react';

export default function MyNotesPage() {
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state.notes);

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(
      fetchNotes({
        search,
        subject: subjectFilter,
        semester: semesterFilter,
        sort: sortBy,
      })
    );
  }, [dispatch, search, subjectFilter, semesterFilter, sortBy]);

  const handleDownload = (noteId) => {
    window.open(`/api/notes/${noteId}/download`, '_blank');
  };

  const uniqueSubjects = ['All', ...new Set(notes.map((n) => n.subject).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest block">
            DIRECTORY // 02
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1">
            Personal Notes Registry
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase mt-0.5">
            Archived and indexed digital study units ({notes.length} total)
          </p>
        </div>

        <Link
          to="/notes/upload"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-swiss-red transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Upload Notes</span>
        </Link>
      </div>

      {/* Filter Terminal (Swiss Table-Top Filter) */}
      <div className="border border-black bg-white p-4 font-mono text-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH BY KEYWORD, FORMULA, TOPIC..."
            className="w-full px-3 py-2 border border-black text-xs font-mono uppercase focus:outline-none focus:bg-zinc-50"
          />
        </div>

        {/* Filter Selects */}
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

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">ORDER:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-2 border border-black bg-white uppercase font-bold text-xs focus:outline-none"
            >
              <option value="newest">NEWEST</option>
              <option value="oldest">OLDEST</option>
              <option value="title">TITLE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase text-zinc-500">
          [ ACCESSING DATABASE RECORDS... ]
        </div>
      ) : notes.length === 0 ? (
        <div className="border border-black bg-white p-16 text-center max-w-lg mx-auto space-y-4 font-mono">
          <h3 className="font-bold text-black uppercase text-base">Zero records matched</h3>
          <p className="text-xs text-zinc-500 font-sans">
            Modify current search filters or upload a new handwritten study sheet to create notes.
          </p>
          <Link
            to="/notes/upload"
            className="inline-block px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase hover:bg-swiss-red transition-colors"
          >
            Intake New Note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={(id) => dispatch(deleteNote(id))}
              onShareToggle={(id) => dispatch(toggleShareNote(id))}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

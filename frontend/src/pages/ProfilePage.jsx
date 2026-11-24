import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, fetchProfile } from '../redux/slices/authSlice.js';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, stats, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    course: '',
    semester: 'Semester 1',
    subjectsInput: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        course: user.course || '',
        semester: user.semester || 'Semester 1',
        subjectsInput: (user.subjects || []).join(', '),
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subjectsArray = formData.subjectsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await dispatch(
      updateProfile({
        name: formData.name,
        course: formData.course,
        semester: formData.semester,
        subjects: subjectsArray,
      })
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-black pb-4">
        <span className="text-xs font-bold text-swiss-red uppercase tracking-widest block">
          STUDENT IDENTIFICATION RECORD
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1 font-sans">
          Academic Profile & Preferences
        </h1>
        <p className="text-xs text-zinc-500 uppercase mt-0.5">
          Matriculation Record, Degree Curriculum & Enrolled Subjects
        </p>
      </div>

      {/* Profile Overview Card (Swiss Typographic Grid) */}
      <div className="border border-black bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 border-2 border-black bg-black text-white font-mono font-bold text-2xl flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase text-black font-sans">{user?.name}</h2>
            <p className="text-xs text-zinc-500 uppercase font-mono">
              EMAIL: {user?.email}
            </p>
            <p className="text-xs font-bold uppercase text-swiss-red mt-1">
              CURRICULUM: {user?.course} /// {user?.semester}
            </p>
          </div>
        </div>

        <div className="border border-black bg-zinc-50 px-4 py-2 text-xs font-bold uppercase">
          STREAK: {stats?.studyStreak || user?.studyStreak || 1} DAYS
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-black bg-white divide-y sm:divide-y-0 sm:divide-x divide-black">
        <div className="p-4">
          <span className="text-[10px] text-zinc-500 uppercase block">SAVED NOTES</span>
          <p className="text-2xl font-black text-black mt-1">{stats?.notesCount || 0}</p>
        </div>
        <div className="p-4">
          <span className="text-[10px] text-zinc-500 uppercase block">EXAMS ATTEMPTED</span>
          <p className="text-2xl font-black text-black mt-1">{stats?.totalQuizzesTaken || 0}</p>
        </div>
        <div className="p-4">
          <span className="text-[10px] text-zinc-500 uppercase block">AVERAGE ACCURACY</span>
          <p className="text-2xl font-black text-swiss-red mt-1">{stats?.avgScore || 0}%</p>
        </div>
        <div className="p-4">
          <span className="text-[10px] text-zinc-500 uppercase block">FLASHCARDS</span>
          <p className="text-2xl font-black text-black mt-1">
            {stats?.masteredFlashcards || 0} / {stats?.totalFlashcards || 0}
          </p>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="border border-black bg-white p-6 sm:p-8 space-y-6 text-xs">
        <h3 className="font-sans font-bold uppercase text-black text-base border-b border-black pb-2">
          Update Curriculum Parameters
        </h3>

        {savedSuccess && (
          <div className="p-3 border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
            SUCCESS: Student record updated.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold uppercase text-black mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Degree / Major
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="B.TECH, B.SC, MBBS..."
                className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Semester / Year
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2.5 border border-black bg-white uppercase focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={`Semester ${s}`}>
                    SEMESTER {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-black mb-1">
              Enrolled Subjects (comma separated)
            </label>
            <input
              type="text"
              value={formData.subjectsInput}
              onChange={(e) => setFormData({ ...formData, subjectsInput: e.target.value })}
              placeholder="DATA STRUCTURES, CALCULUS, PHYSICS"
              className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-black hover:bg-swiss-red text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              COMMIT PROFILE MODIFICATIONS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

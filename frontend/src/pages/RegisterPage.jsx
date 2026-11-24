import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../redux/slices/authSlice.js';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: 'B.Tech Computer Science',
    semester: 'Semester 3',
    subjectsInput: 'Data Structures, Operating Systems, Mathematics, Digital Logic',
  });

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { state: { showGuide: true } });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    const subjectsArray = formData.subjectsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        course: formData.course,
        semester: formData.semester,
        subjects: subjectsArray,
      })
    );
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 font-mono">
      <div className="w-full max-w-lg border-2 border-black bg-white p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-2 border-black pb-4 mb-6">
          <span className="text-[10px] font-bold text-swiss-red uppercase tracking-widest block">
            INTAKE REGISTRATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1 font-sans">
            Enroll Scholar
          </h2>
          <p className="text-xs text-zinc-500 uppercase mt-0.5">
            Initialize academic profile and course syllabus
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-swiss-red bg-red-50 text-swiss-red text-xs font-bold flex items-center gap-2 uppercase">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-black mb-1">
              Full Scholar Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="ALEX MORGAN"
              className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50 font-sans"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-black mb-1">
              University Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="ALEX@UNIVERSITY.EDU"
              className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-black mb-1">
              Secret Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="MINIMUM 6 CHARACTERS"
              className="w-full px-3 py-2.5 border border-black focus:outline-none bg-zinc-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Degree / Program
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="B.TECH, B.SC, BCA..."
                className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Semester / Year
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
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
              Active Course Subjects (comma separated)
            </label>
            <input
              type="text"
              name="subjectsInput"
              value={formData.subjectsInput}
              onChange={handleChange}
              placeholder="DATA STRUCTURES, PHYSICS, CALCULUS"
              className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black hover:bg-swiss-red text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            <span>{loading ? '[ ENROLLING... ]' : 'COMPLETE ENROLLMENT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-6 pt-4 border-t border-zinc-200">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-black uppercase hover:underline">
            Authenticate Session
          </Link>
        </p>
      </div>
    </div>
  );
}

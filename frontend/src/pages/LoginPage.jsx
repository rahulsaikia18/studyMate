import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/slices/authSlice.js';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleDemoLogin = () => {
    setEmail('student@university.edu');
    setPassword('studymate123');
    dispatch(loginUser({ email: 'student@university.edu', password: 'studymate123' }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 font-mono">
      <div className="w-full max-w-md border-2 border-black bg-white p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-2 border-black pb-4 mb-6">
          <span className="text-[10px] font-bold text-swiss-red uppercase tracking-widest block">
            AUTHENTICATION PROTOCOL
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1 font-sans">
            Student Access
          </h2>
          <p className="text-xs text-zinc-500 uppercase mt-0.5">
            Log in to your active curriculum terminal
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
              Student Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="NAME@UNIVERSITY.EDU"
              className="w-full px-3 py-2.5 border border-black uppercase focus:outline-none bg-zinc-50"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-black mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-black focus:outline-none bg-zinc-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black hover:bg-swiss-red text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? '[ AUTHENTICATING... ]' : 'AUTHENTICATE & ENTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Account Trigger */}
        <div className="mt-6 pt-6 border-t border-black text-center space-y-2">
          <span className="text-[10px] text-zinc-400 uppercase block">EVALUATOR SHORTCUT</span>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 border border-black bg-zinc-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase transition-colors"
          >
            [ Quick Login Demo Scholar ]
          </button>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6 pt-4 border-t border-zinc-200">
          Unregistered?{' '}
          <Link to="/register" className="font-bold text-black uppercase hover:underline">
            Register Student Account
          </Link>
        </p>
      </div>
    </div>
  );
}

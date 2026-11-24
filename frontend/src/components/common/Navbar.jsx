import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';
import {
  Menu,
  X,
  LogOut,
  User,
  Plus,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, stats } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', num: '01' },
    { name: 'Notes', path: '/notes', num: '02' },
    { name: 'Upload', path: '/notes/upload', num: '03', isAction: true },
    { name: 'AI Tutor', path: '/ai-learning', num: '04' },
    { name: 'Practice', path: '/practice', num: '05' },
    { name: 'Flashcards', path: '/flashcards', num: '06' },
    { name: 'Planner', path: '/planner', num: '07' },
    { name: 'Community', path: '/community', num: '08' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Section */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-black text-white font-mono font-bold text-base flex items-center justify-center transition-transform group-hover:scale-95">
            S
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-black uppercase">
                StudyMate
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-black text-white uppercase">
                AI
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
              International Academic System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Swiss Grid Style) */}
        {isAuthenticated && (
          <nav className="hidden lg:flex items-center h-full">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              if (link.isAction) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="h-9 px-3.5 mx-2 bg-swiss-red text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-black transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Upload</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`h-full px-3.5 flex items-center text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors ${
                    active
                      ? 'border-black text-black bg-zinc-50'
                      : 'border-transparent text-zinc-600 hover:text-black hover:bg-zinc-50/50'
                  }`}
                >
                  <span className="text-[10px] text-zinc-400 mr-1.5 font-normal">{link.num}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Daily Streak Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 border border-black bg-zinc-50 text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-swiss-red animate-ping" />
                <span className="text-black uppercase">
                  {stats?.studyStreak || user?.studyStreak || 1}D STREAK
                </span>
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 border border-black hover:bg-zinc-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-zinc-200 text-black font-mono font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="hidden md:inline-block text-xs font-mono font-bold text-black uppercase max-w-[100px] truncate px-1">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-1 w-64 bg-white border border-black shadow-none py-2 z-50 animate-in fade-in"
                  >
                    <div className="px-4 py-2 border-b border-zinc-200">
                      <p className="text-xs font-mono font-bold uppercase text-black truncate">{user?.name}</p>
                      <p className="text-[11px] font-mono text-zinc-500 truncate">{user?.email}</p>
                      <p className="text-[10px] font-mono text-swiss-blue font-bold uppercase mt-1">
                        {user?.course} / {user?.semester}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase text-zinc-800 hover:bg-black hover:text-white transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Student Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase text-swiss-red hover:bg-swiss-red hover:text-white transition-colors text-left border-t border-zinc-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 border border-black text-black hover:bg-zinc-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/community"
                className="hidden sm:inline-flex text-xs font-mono font-bold uppercase tracking-wider text-black px-3 py-1.5 hover:underline"
              >
                Notes Library
              </Link>
              <Link
                to="/login"
                className="text-xs font-mono font-bold uppercase tracking-wider text-black border border-black px-3.5 py-1.5 hover:bg-zinc-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-mono font-bold uppercase tracking-wider text-white bg-black px-4 py-1.5 hover:bg-zinc-800 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="lg:hidden bg-white border-b border-black px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider border-l-2 ${
                  active
                    ? 'border-black bg-zinc-100 text-black'
                    : 'border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-black'
                }`}
              >
                <span>{link.name}</span>
                <span className="text-[10px] text-zinc-400">{link.num}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-zinc-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase text-swiss-red hover:bg-zinc-50"
            >
              <span>Sign Out</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

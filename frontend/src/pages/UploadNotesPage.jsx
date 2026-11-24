import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadNoteFile, createManualNote } from '../redux/slices/notesSlice.js';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';

export default function UploadNotesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uploading, error } = useSelector((state) => state.notes);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'manual'
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subject: user?.subjects?.[0] || 'Computer Science',
    semester: user?.semester || 'Semester 1',
    tags: 'lecture, exam-prep',
    language: 'en',
    structuredContent: '',
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title: selected.name.replace(/\.[^/.]+$/, ''),
        }));
      }
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('subject', formData.subject);
    data.append('semester', formData.semester);
    data.append('tags', formData.tags);
    data.append('language', formData.language);

    const result = await dispatch(uploadNoteFile(data));
    if (!result.error && result.payload?._id) {
      navigate(`/notes/${result.payload._id}`);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.structuredContent) return;

    const result = await dispatch(
      createManualNote({
        title: formData.title,
        subject: formData.subject,
        semester: formData.semester,
        tags: formData.tags.split(',').map((t) => t.trim()),
        structuredContent: formData.structuredContent,
        language: formData.language,
      })
    );

    if (!result.error && result.payload?._id) {
      navigate(`/notes/${result.payload._id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-black pb-4">
        <span className="font-mono text-xs font-bold text-swiss-red uppercase tracking-widest block">
          DOCUMENT INTAKE TERMINAL // 03
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tightest text-black mt-1">
          Digitize Course Material
        </h1>
        <p className="font-mono text-xs text-zinc-500 uppercase mt-0.5">
          Automated OCR Transcription & Structural Markdown Formatting
        </p>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex border-b border-black font-mono text-xs font-bold uppercase">
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-3 px-6 border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ 01 / Image & PDF OCR ]
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`py-3 px-6 border-b-2 transition-colors ${
            activeTab === 'manual'
              ? 'border-black bg-white text-black'
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          [ 02 / Direct Markdown Entry ]
        </button>
      </div>

      {error && (
        <div className="p-4 border border-swiss-red bg-red-50 text-swiss-red text-xs font-mono font-bold flex items-center gap-2 uppercase">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>ERROR: {error}</span>
        </div>
      )}

      {activeTab === 'upload' ? (
        <form onSubmit={handleUploadSubmit} className="space-y-6 border border-black bg-white p-6 sm:p-8 font-mono">
          {/* File Dropzone */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-black mb-2">
              Select Document File (JPG, PNG, WEBP, PDF)
            </label>
            <label className="border-2 border-dashed border-black hover:bg-zinc-50 p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
              <input
                type="file"
                required
                accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold mx-auto text-sm">
                    FILE
                  </div>
                  <p className="font-bold text-black uppercase text-sm">{file.name}</p>
                  <p className="text-zinc-500 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR INTAKE</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-black mx-auto stroke-1" />
                  <p className="font-bold text-black uppercase text-sm">DRAG & DROP OR BROWSE LOCAL SYSTEM</p>
                  <p className="text-[11px] text-zinc-400 uppercase">
                    MAXIMUM PAYLOAD: 25MB • HANDWRITING OCR OPTIMIZED
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Preview for images */}
          {previewUrl && (
            <div className="p-4 border border-black bg-zinc-50">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">IMAGE VERIFICATION PREVIEW</span>
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="max-h-56 object-contain mx-auto border border-zinc-300"
              />
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Note Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Operating Systems: Process Scheduling"
                className="w-full px-3 py-2.5 border border-black font-sans uppercase focus:outline-none focus:bg-zinc-50"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2.5 border border-black font-sans uppercase focus:outline-none focus:bg-zinc-50"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Semester
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

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                OCR Script Optimization
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2.5 border border-black bg-white uppercase focus:outline-none"
              >
                <option value="en">English (Latin Script)</option>
                <option value="hi">Hindi (Devanagari / हिन्दी)</option>
                <option value="as">Assamese (অসমীয়া)</option>
                <option value="other">Mixed / Multilingual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Metadata Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="MIDTERM, UNIT-2, FORMULAS"
              className="w-full px-3 py-2.5 border border-black text-xs font-sans uppercase focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-4 bg-black hover:bg-swiss-red text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span>[ PROCESSING OCR & SYNTHESIZING STRUCTURED NOTES... ]</span>
            ) : (
              <span>EXECUTE INTAKE & GENERATE NOTES</span>
            )}
          </button>
        </form>
      ) : (
        /* Manual Note Form */
        <form onSubmit={handleManualSubmit} className="space-y-6 border border-black bg-white p-6 sm:p-8 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Note Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Distributed Database Architecture"
                className="w-full px-3 py-2.5 border border-black font-sans uppercase focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-black mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2.5 border border-black font-sans uppercase focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-black mb-1">
              Structured Markdown Body
            </label>
            <textarea
              rows={14}
              required
              value={formData.structuredContent}
              onChange={(e) => setFormData({ ...formData, structuredContent: e.target.value })}
              placeholder="# TITLE&#10;&#10;## 01 / PRINCIPLE&#10;Type study definitions and markdown notes here..."
              className="w-full p-4 border border-black font-mono text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black hover:bg-swiss-red text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors"
          >
            RECORD & SAVE DIGITAL NOTE
          </button>
        </form>
      )}
    </div>
  );
}

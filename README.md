# StudyMate — International Academic Learning System

> **AI-Powered Smart Learning & Notes-Sharing Platform for College & University Students**  
> Designed under the **International Typographic Style (Swiss Style)**: mathematical grid discipline, high-contrast typography, clear asymmetric hierarchy, and functional precision.

---

## 1. Architectural Highlights & Features

### 1. Multimodal Document Intake (Photo & PDF to Digital Notes)
- Ingest handwritten lecture notes, textbook photographs, and university lecture PDFs.
- AI & OCR extraction with native multilingual support for **English**, **Hindi (हिन्दी)**, and **Assamese (অসমীয়া)** scripts.
- Automatically formats unstructured handwriting into organized digital study sheets with headings, bullet points, and LaTeX equations.

### 2. Explain This (Exam-Grade Deconstruction)
- Select any confusing concept, formula, or paragraph directly from your notes.
- StudyMate removes academic jargon, provides intuitive real-world analogies, and provides university marking tips.

### 3. AI Question Synthesis & Evaluation
- Synthesize practice exams from notes with MCQs, True/False, and written short questions.
- Multi-point evaluation: auto-scores objective questions and uses AI to grade written answers, awarding marks and constructive examiner critique.

### 4. Active-Recall Flashcards
- Double-sided 3D flip revision cards focusing on core formulas, definitions, and theorems.
- Tracks mastery percentages for spaced repetition.

### 5. Semester Study Planner
- Exam deadline countdown matrix with available study hours calibration.
- Generates 7-day milestone study roadmaps and daily study target checklists.

### 6. Community Notes Sharing
- Public repository where students across universities can browse, preview, download, and clone shared notes to their personal libraries.

### 7. Interactive Onboarding Walkthrough
- Step-by-step animated guide demonstrating document intake, markdown structuring, concept explanation, exam grading, and active recall.

---

## 2. Technology Stack

- **Frontend**: React.js (JavaScript ES6+), Vite, JSX, Tailwind CSS, Axios, React Router DOM, Redux Toolkit, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js (ES Modules), Express.js, MongoDB, Mongoose, JWT Authentication, bcryptjs, Multer, pdf-parse.
- **AI Engine**: Groq Llama architecture (`llama-3.3-70b-versatile`, `llama-3.1-70b-versatile`, `llama3-70b-8192`, `llama-3.2-11b-vision-preview`) with intelligent fallback mechanisms.
- **Strict Rule Compliance**: JavaScript only (`.js` and `.jsx`). Zero TypeScript.

---

## 3. Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Database & Backend Configuration
In `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/studymate
JWT_SECRET=studymate_super_secret_jwt_key_2026_student_success
GROQ_API_KEY=your_groq_api_key_here
```

To run the seed script for demo data:
```bash
cd backend
node scripts/seed.js
```
*Pre-configured Demo Scholar:*
- **Email:** `student@university.edu`
- **Password:** `studymate123`

To start the backend server:
```bash
cd backend
npm start
```

### 2. Frontend Launch
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

import express from 'express';
import {
  explainText,
  askNote,
  generateQuestions,
  evaluateAnswer,
  generateFlashcards,
  generateSummary,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/explain', explainText);
router.post('/ask', askNote);
router.post('/generate-questions', generateQuestions);
router.post('/evaluate-answer', evaluateAnswer);
router.post('/generate-flashcards', generateFlashcards);
router.post('/generate-summary', generateSummary);

export default router;

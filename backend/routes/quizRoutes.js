import express from 'express';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuizAttempt,
  getQuizAttempts,
  deleteQuiz,
} from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getQuizzes);
router.post('/', createQuiz);
router.get('/attempts', getQuizAttempts);
router.get('/:id', getQuizById);
router.post('/submit', submitQuizAttempt);
router.delete('/:id', deleteQuiz);

export default router;

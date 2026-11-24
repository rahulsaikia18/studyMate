import express from 'express';
import {
  getDecks,
  getDeckById,
  createDeck,
  toggleCardMastery,
  deleteDeck,
} from '../controllers/flashcardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getDecks);
router.post('/', createDeck);
router.get('/:id', getDeckById);
router.patch('/:deckId/cards/:cardId/mastery', toggleCardMastery);
router.delete('/:id', deleteDeck);

export default router;

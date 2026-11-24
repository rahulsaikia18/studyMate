import express from 'express';
import {
  getSharedNotes,
  getSharedNoteById,
  cloneSharedNote,
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Allow browsing shared notes with or without login, but protect cloning
router.get('/', getSharedNotes);
router.get('/:id', getSharedNoteById);
router.post('/:id/clone', protect, cloneSharedNote);

export default router;

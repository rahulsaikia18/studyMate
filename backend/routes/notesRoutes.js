import express from 'express';
import {
  uploadAndExtractNote,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  toggleShareNote,
  downloadNote,
} from '../controllers/notesController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotes);
router.post('/', createNote);
router.post('/upload', upload.single('file'), uploadAndExtractNote);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/share', toggleShareNote);
router.get('/:id/download', downloadNote);

export default router;

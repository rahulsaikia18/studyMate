import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['definition', 'formula', 'concept', 'general'],
    default: 'concept',
  },
  mastered: {
    type: Boolean,
    default: false,
  },
  lastReviewed: {
    type: Date,
    default: null,
  },
});

const flashcardDeckSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide deck title'],
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      default: null,
    },
    cards: [flashcardSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FlashcardDeck = mongoose.model('FlashcardDeck', flashcardDeckSchema);
export default FlashcardDeck;

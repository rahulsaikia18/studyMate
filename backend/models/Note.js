import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide note title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please specify subject'],
      trim: true,
    },
    semester: {
      type: String,
      default: 'Semester 1',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    rawExtractedText: {
      type: String,
      default: '',
    },
    structuredContent: {
      type: String,
      required: [true, 'Note content cannot be empty'],
    },
    summary: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'as', 'other'],
      default: 'en',
    },
    fileType: {
      type: String,
      enum: ['image', 'pdf', 'text', 'none'],
      default: 'none',
    },
    originalFileName: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    shareScope: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast community search
noteSchema.index({ title: 'text', subject: 'text', structuredContent: 'text', tags: 'text' });

const Note = mongoose.model('Note', noteSchema);
export default Note;

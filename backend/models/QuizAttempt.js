import mongoose from 'mongoose';

const answerEvaluationSchema = new mongoose.Schema({
  questionIndex: Number,
  questionText: String,
  type: String,
  studentAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  aiMarks: {
    type: Number,
    default: 0,
  },
  maxMarks: {
    type: Number,
    default: 1,
  },
  feedback: {
    type: String,
    default: '',
  },
  modelAnswer: {
    type: String,
    default: '',
  },
});

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [answerEvaluationSchema],
    totalScore: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    feedbackSummary: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;

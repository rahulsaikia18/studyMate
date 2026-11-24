import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { evaluateWrittenAnswer } from '../services/groqService.js';

export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ user: req.user._id })
      .populate('noteId', 'title subject')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('noteId', 'title subject structuredContent');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const createQuiz = async (req, res, next) => {
  try {
    const { title, subject, difficulty, questionType, questions, noteId } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide quiz title and at least one question' });
    }

    const quiz = await Quiz.create({
      title,
      subject: subject || 'General',
      difficulty: difficulty || 'medium',
      questionType: questionType || 'all',
      questions,
      noteId: noteId || null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId, studentAnswers } = req.body;
    // studentAnswers: array of { questionIndex, answer }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let totalScore = 0;
    let maxScore = 0;
    const evaluatedAnswers = [];

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      const answerObj = (studentAnswers || []).find((a) => a.questionIndex === i);
      const studentAns = answerObj ? answerObj.answer : '';
      const points = q.points || 1;
      maxScore += points;

      if (q.type === 'mcq' || q.type === 'true_false') {
        const isCorrect =
          studentAns &&
          studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        const score = isCorrect ? points : 0;
        totalScore += score;

        evaluatedAnswers.push({
          questionIndex: i,
          questionText: q.question,
          type: q.type,
          studentAnswer: studentAns || '(No answer)',
          correctAnswer: q.correctAnswer,
          isCorrect,
          aiMarks: score,
          maxMarks: points,
          feedback: isCorrect
            ? 'Correct! Well done.'
            : `Incorrect. The correct answer is: ${q.correctAnswer}. ${q.explanation || ''}`,
          modelAnswer: q.correctAnswer,
        });
      } else {
        // Short written answer: evaluate using AI
        const evaluation = await evaluateWrittenAnswer({
          question: q.question,
          studentAnswer: studentAns || '',
          correctAnswer: q.correctAnswer,
          maxMarks: points,
        });

        const marks = evaluation.marksAwarded || 0;
        totalScore += marks;

        evaluatedAnswers.push({
          questionIndex: i,
          questionText: q.question,
          type: 'short',
          studentAnswer: studentAns || '(No answer)',
          correctAnswer: q.correctAnswer,
          isCorrect: evaluation.isAcceptable,
          aiMarks: marks,
          maxMarks: points,
          feedback: evaluation.feedback,
          modelAnswer: evaluation.idealAnswer || q.correctAnswer,
        });
      }
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    let feedbackSummary = 'Good effort! Review the missed questions to reinforce weak areas.';
    if (percentage >= 85) {
      feedbackSummary = 'Outstanding mastery! You have an excellent grasp of this material.';
    } else if (percentage >= 65) {
      feedbackSummary = 'Solid performance! Fine-tune the specific points noted in your feedback.';
    } else if (percentage < 50) {
      feedbackSummary = 'Needs revision. Go through your digital notes and re-attempt the quiz.';
    }

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      user: req.user._id,
      answers: evaluatedAnswers,
      totalScore,
      maxScore,
      percentage,
      feedbackSummary,
    });

    res.json({
      success: true,
      attempt,
      summary: {
        totalScore,
        maxScore,
        percentage,
        feedbackSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate('quiz', 'title subject difficulty')
      .sort({ completedAt: -1 });

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found or unauthorized' });
    }

    await QuizAttempt.deleteMany({ quiz: quiz._id });

    res.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

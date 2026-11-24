import Note from '../models/Note.js';
import Quiz from '../models/Quiz.js';
import FlashcardDeck from '../models/FlashcardDeck.js';
import {
  explainStudyContent,
  askNotesAssistant,
  generateQuestionsFromNotes,
  evaluateWrittenAnswer,
  generateFlashcardsFromNotes,
  generateRevisionSummary,
} from '../services/groqService.js';

export const explainText = async (req, res, next) => {
  try {
    const { text, noteId } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide text to explain' });
    }

    let noteContext = '';
    if (noteId) {
      const note = await Note.findById(noteId);
      if (note) {
        noteContext = `Note Title: ${note.title} (Subject: ${note.subject})\n${note.structuredContent.slice(0, 1500)}`;
      }
    }

    const explanation = await explainStudyContent({
      text,
      noteContext,
      targetAudience: req.user?.course ? `${req.user.course} student` : 'college student',
    });

    res.json({
      success: true,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};

export const askNote = async (req, res, next) => {
  try {
    const { noteId, query, directContent } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a question to ask' });
    }

    let contentToQuery = directContent || '';
    if (!contentToQuery && noteId) {
      const note = await Note.findById(noteId);
      if (note) {
        contentToQuery = note.structuredContent;
      }
    }

    if (!contentToQuery) {
      return res.status(400).json({ success: false, message: 'No note content provided to query' });
    }

    const answer = await askNotesAssistant({
      noteContent: contentToQuery,
      query,
    });

    res.json({
      success: true,
      query,
      answer,
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuestions = async (req, res, next) => {
  try {
    const { noteId, content, count = 5, difficulty = 'medium', questionType = 'all', saveAsQuiz = true, title } = req.body;

    let studyContent = content || '';
    let subject = 'General Studies';
    let quizTitle = title || 'Smart Quiz Practice';

    if (noteId) {
      const note = await Note.findById(noteId);
      if (note) {
        studyContent = note.structuredContent;
        subject = note.subject;
        quizTitle = title || `Practice Quiz: ${note.title}`;
      }
    }

    if (!studyContent) {
      return res.status(400).json({ success: false, message: 'No study material provided to generate questions' });
    }

    const questions = await generateQuestionsFromNotes({
      content: studyContent,
      count: parseInt(count, 10) || 5,
      difficulty,
      questionType,
    });

    let savedQuiz = null;
    if (saveAsQuiz) {
      savedQuiz = await Quiz.create({
        title: quizTitle,
        noteId: noteId || null,
        subject,
        difficulty,
        questionType,
        questions,
        user: req.user._id,
      });
    }

    res.json({
      success: true,
      questions,
      quiz: savedQuiz,
      message: 'Questions generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const evaluateAnswer = async (req, res, next) => {
  try {
    const { question, studentAnswer, correctAnswer, maxMarks = 2 } = req.body;

    if (!question || studentAnswer === undefined) {
      return res.status(400).json({ success: false, message: 'Question and student answer are required' });
    }

    const evaluation = await evaluateWrittenAnswer({
      question,
      studentAnswer,
      correctAnswer: correctAnswer || '',
      maxMarks: parseFloat(maxMarks) || 2,
    });

    res.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    next(error);
  }
};

export const generateFlashcards = async (req, res, next) => {
  try {
    const { noteId, content, count = 6, title, saveAsDeck = true } = req.body;

    let studyContent = content || '';
    let subject = 'General Studies';
    let deckTitle = title || 'Flashcards Deck';

    if (noteId) {
      const note = await Note.findById(noteId);
      if (note) {
        studyContent = note.structuredContent;
        subject = note.subject;
        deckTitle = title || `Flashcards: ${note.title}`;
      }
    }

    if (!studyContent) {
      return res.status(400).json({ success: false, message: 'No study material provided' });
    }

    const cards = await generateFlashcardsFromNotes(studyContent, parseInt(count, 10) || 6);

    let savedDeck = null;
    if (saveAsDeck) {
      savedDeck = await FlashcardDeck.create({
        title: deckTitle,
        subject,
        noteId: noteId || null,
        cards,
        user: req.user._id,
      });
    }

    res.json({
      success: true,
      cards,
      deck: savedDeck,
      message: 'Flashcards generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { noteId, content } = req.body;

    let studyContent = content || '';
    let targetNote = null;

    if (noteId) {
      targetNote = await Note.findById(noteId);
      if (targetNote) {
        studyContent = targetNote.structuredContent;
      }
    }

    if (!studyContent) {
      return res.status(400).json({ success: false, message: 'No note content provided' });
    }

    const summary = await generateRevisionSummary(studyContent);

    if (targetNote && targetNote.user.toString() === req.user._id.toString()) {
      targetNote.summary = summary;
      await targetNote.save();
    }

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

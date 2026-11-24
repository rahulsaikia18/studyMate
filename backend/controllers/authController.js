import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Note from '../models/Note.js';
import QuizAttempt from '../models/QuizAttempt.js';
import FlashcardDeck from '../models/FlashcardDeck.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'studymate_super_secret_jwt_key_2026_student_success',
    { expiresIn: '30d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, course, semester, subjects } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A student account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      course: course || 'Bachelor of Science / Technology',
      semester: semester || 'Semester 1',
      subjects: subjects && subjects.length > 0 ? subjects : ['Computer Science', 'Mathematics', 'Physics'],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. No student account found with this email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password is incorrect' });
    }

    // Update study streak calculation
    const now = new Date();
    const lastActive = new Date(user.lastActiveDate || now);
    const diffHours = (now - lastActive) / (1000 * 60 * 60);

    if (diffHours >= 20 && diffHours <= 48) {
      user.studyStreak = (user.studyStreak || 1) + 1;
    } else if (diffHours > 48) {
      user.studyStreak = 1;
    }
    user.lastActiveDate = now;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Compute live dashboard metrics
    const [notesCount, attempts, flashcardDecks] = await Promise.all([
      Note.countDocuments({ user: user._id }),
      QuizAttempt.find({ user: user._id }),
      FlashcardDeck.find({ user: user._id }),
    ]);

    const totalQuizzesTaken = attempts.length;
    const avgScore =
      totalQuizzesTaken > 0
        ? Math.round(
            attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
              totalQuizzesTaken
          )
        : 0;

    let totalCards = 0;
    let masteredCards = 0;
    flashcardDecks.forEach((deck) => {
      totalCards += deck.cards.length;
      masteredCards += deck.cards.filter((c) => c.mastered).length;
    });

    res.json({
      success: true,
      user,
      stats: {
        notesCount,
        totalQuizzesTaken,
        avgScore,
        totalFlashcards: totalCards,
        masteredFlashcards: masteredCards,
        studyStreak: user.studyStreak || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, course, semester, subjects, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (course) user.course = course;
    if (semester) user.semester = semester;
    if (subjects) user.subjects = subjects;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      user,
      message: 'Student profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

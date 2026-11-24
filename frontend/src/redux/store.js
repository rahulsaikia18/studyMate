import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import notesReducer from './slices/notesSlice.js';
import quizReducer from './slices/quizSlice.js';
import flashcardReducer from './slices/flashcardSlice.js';
import plannerReducer from './slices/plannerSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    quizzes: quizReducer,
    flashcards: flashcardReducer,
    planner: plannerReducer,
  },
});

export default store;

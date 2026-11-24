import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/quizzes');
      return response.data.quizzes;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quizzes/fetchQuizById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      return response.data.quiz;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const generateQuizFromNote = createAsyncThunk(
  'quizzes/generateQuizFromNote',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/generate-questions', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate quiz');
    }
  }
);

export const submitQuizAttempt = createAsyncThunk(
  'quizzes/submitQuizAttempt',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/quizzes/submit', submissionData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit quiz attempt');
    }
  }
);

export const fetchQuizAttempts = createAsyncThunk(
  'quizzes/fetchQuizAttempts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/quizzes/attempts');
      return response.data.attempts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quiz attempts');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quizzes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete quiz');
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    currentQuiz: null,
    attemptResult: null,
    attempts: [],
    loading: false,
    generating: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
      state.attemptResult = null;
    },
    clearAttemptResult: (state) => {
      state.attemptResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Quiz By Id
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.currentQuiz = action.payload;
      })
      // Generate Quiz
      .addCase(generateQuizFromNote.pending, (state) => {
        state.generating = true;
      })
      .addCase(generateQuizFromNote.fulfilled, (state, action) => {
        state.generating = false;
        if (action.payload.quiz) {
          state.quizzes.unshift(action.payload.quiz);
          state.currentQuiz = action.payload.quiz;
        }
      })
      .addCase(generateQuizFromNote.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      })
      // Submit Attempt
      .addCase(submitQuizAttempt.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.submitting = false;
        state.attemptResult = action.payload;
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      // Fetch Attempts
      .addCase(fetchQuizAttempts.fulfilled, (state, action) => {
        state.attempts = action.payload;
      })
      // Delete Quiz
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
      });
  },
});

export const { clearCurrentQuiz, clearAttemptResult } = quizSlice.actions;
export default quizSlice.reducer;

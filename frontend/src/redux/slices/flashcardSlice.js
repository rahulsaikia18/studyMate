import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDecks = createAsyncThunk(
  'flashcards/fetchDecks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/flashcards');
      return response.data.decks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch flashcard decks');
    }
  }
);

export const fetchDeckById = createAsyncThunk(
  'flashcards/fetchDeckById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flashcards/${id}`);
      return response.data.deck;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch deck');
    }
  }
);

export const generateDeckFromNote = createAsyncThunk(
  'flashcards/generateDeckFromNote',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/generate-flashcards', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate flashcards');
    }
  }
);

export const toggleCardMastery = createAsyncThunk(
  'flashcards/toggleCardMastery',
  async ({ deckId, cardId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/flashcards/${deckId}/cards/${cardId}/mastery`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update mastery');
    }
  }
);

export const deleteDeck = createAsyncThunk(
  'flashcards/deleteDeck',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/flashcards/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete deck');
    }
  }
);

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState: {
    decks: [],
    currentDeck: null,
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {
    clearCurrentDeck: (state) => {
      state.currentDeck = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Decks
      .addCase(fetchDecks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDecks.fulfilled, (state, action) => {
        state.loading = false;
        state.decks = action.payload;
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Deck By Id
      .addCase(fetchDeckById.fulfilled, (state, action) => {
        state.currentDeck = action.payload;
      })
      // Generate Deck
      .addCase(generateDeckFromNote.pending, (state) => {
        state.generating = true;
      })
      .addCase(generateDeckFromNote.fulfilled, (state, action) => {
        state.generating = false;
        if (action.payload.deck) {
          state.decks.unshift(action.payload.deck);
          state.currentDeck = action.payload.deck;
        }
      })
      .addCase(generateDeckFromNote.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      })
      // Toggle Mastery
      .addCase(toggleCardMastery.fulfilled, (state, action) => {
        if (state.currentDeck && state.currentDeck._id === action.payload.deck._id) {
          state.currentDeck = action.payload.deck;
        }
        const idx = state.decks.findIndex((d) => d._id === action.payload.deck._id);
        if (idx !== -1) {
          state.decks[idx] = action.payload.deck;
        }
      })
      // Delete Deck
      .addCase(deleteDeck.fulfilled, (state, action) => {
        state.decks = state.decks.filter((d) => d._id !== action.payload);
      });
  },
});

export const { clearCurrentDeck } = flashcardSlice.actions;
export default flashcardSlice.reducer;

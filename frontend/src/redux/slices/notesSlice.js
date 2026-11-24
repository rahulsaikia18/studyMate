import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/notes', { params });
      return response.data.notes;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch notes');
    }
  }
);

export const fetchNoteById = createAsyncThunk(
  'notes/fetchNoteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch note');
    }
  }
);

export const uploadNoteFile = createAsyncThunk(
  'notes/uploadNoteFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/notes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.note;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload and extract note');
    }
  }
);

export const createManualNote = createAsyncThunk(
  'notes/createManualNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await api.post('/notes', noteData);
      return response.data.note;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notes/${id}`, data);
      return response.data.note;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete note');
    }
  }
);

export const toggleShareNote = createAsyncThunk(
  'notes/toggleShareNote',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/notes/${id}/share`);
      return response.data.note;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to share note');
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    activeNote: null,
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {
    clearActiveNote: (state) => {
      state.activeNote = null;
    },
    setActiveNoteContent: (state, action) => {
      if (state.activeNote) {
        state.activeNote.structuredContent = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Note By Id
      .addCase(fetchNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.activeNote = action.payload.note;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Note
      .addCase(uploadNoteFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadNoteFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.notes.unshift(action.payload);
        state.activeNote = action.payload;
      })
      .addCase(uploadNoteFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // Create Manual Note
      .addCase(createManualNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
        state.activeNote = action.payload;
      })
      // Update Note
      .addCase(updateNote.fulfilled, (state, action) => {
        state.activeNote = action.payload;
        const index = state.notes.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      // Delete Note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n._id !== action.payload);
        if (state.activeNote?._id === action.payload) {
          state.activeNote = null;
        }
      })
      // Toggle Share
      .addCase(toggleShareNote.fulfilled, (state, action) => {
        if (state.activeNote?._id === action.payload._id) {
          state.activeNote = action.payload;
        }
        const index = state.notes.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      });
  },
});

export const { clearActiveNote, setActiveNoteContent } = notesSlice.actions;
export default notesSlice.reducer;

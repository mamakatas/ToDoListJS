import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksAPI } from '../../services/api';

export const fetchMessagesForTask = createAsyncThunk(
  'messages/fetchMessagesForTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.getMessagesForTask(taskId);
      return { taskId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch messages');
    }
  }
);

export const addMessageToTask = createAsyncThunk(
  'messages/addMessageToTask',
  async ({ taskId, messageContent }, { rejectWithValue }) => {
    try {
      await tasksAPI.addMessageToTask(taskId, messageContent);
      return {
        taskId,
        message: {
          content: messageContent,
          createdAt: new Date().toISOString(),
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add message');
    }
  }
);

const initialState = {
  messages: {},
  loading: false,
  error: null
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = {};
    },
    clearMessagesForTask: (state, action) => {
      delete state.messages[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages for Task
      .addCase(fetchMessagesForTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesForTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, messages } = action.payload;
        state.messages[taskId] = messages;
        state.error = null;
      })
      .addCase(fetchMessagesForTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Message to Task
      .addCase(addMessageToTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageToTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, message } = action.payload;
        if (!state.messages[taskId]) {
          state.messages[taskId] = [];
        }
        state.messages[taskId].push(message);
        state.error = null;
      })
      .addCase(addMessageToTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessages, clearMessagesForTask } = messageSlice.actions;

export const selectMessagesForTask = (state, taskId) => state.messages.messages[taskId] || [];
export const selectMessagesLoading = (state) => state.messages.loading;
export const selectMessagesError = (state) => state.messages.error;

export default messageSlice.reducer; 
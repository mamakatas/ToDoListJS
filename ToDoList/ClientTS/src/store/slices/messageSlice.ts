import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { tasksAPI } from '../../services/api';
import type { RootState } from '../index';

interface Message {
  id?: number;
  userName?: string;
  content: string;
  createdAt?: string;
  response?: string;
}

interface MessageState {
  messages: { [taskId: number]: Message[] };
  loading: boolean;
  error: string | null;
}

export const fetchMessagesForTask = createAsyncThunk(
  'messages/fetchMessagesForTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.getMessagesForTask(taskId);
      return { taskId, messages: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch messages');
    }
  }
);

export const addMessageToTask = createAsyncThunk(
  'messages/addMessageToTask',
  async ({ taskId, messageContent }: { taskId: number; messageContent: string }, { rejectWithValue }) => {
    try {
      await tasksAPI.addMessageToTask(taskId, messageContent);
      return {
        taskId,
        message: {
          content: messageContent,
          createdAt: new Date().toISOString(),
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to add message');
    }
  }
);

const initialState: MessageState = {
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
    clearMessagesForTask: (state, action: PayloadAction<number>) => {
      delete state.messages[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesForTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesForTask.fulfilled, (state, action: PayloadAction<{ taskId: number; messages: Message[] }>) => {
        state.loading = false;
        const { taskId, messages } = action.payload;
        state.messages[taskId] = messages;
        state.error = null;
      })
      .addCase(fetchMessagesForTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMessageToTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageToTask.fulfilled, (state, action: PayloadAction<{ taskId: number; message: Message }>) => {
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
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearMessages, clearMessagesForTask } = messageSlice.actions;

export const selectMessagesForTask = (state: RootState, taskId: number) => state.messages.messages[taskId] || [];
export const selectMessagesLoading = (state: RootState) => state.messages.loading;
export const selectMessagesError = (state: RootState) => state.messages.error;

export default messageSlice.reducer; 
import { createSlice } from '@reduxjs/toolkit';

type Message = {
  enable: boolean;
  message: string;
};

const initialState: Message = { enable: false, message: '' };

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    showMessage(state, action: { payload: string }) {
      state.enable = true;
      state.message = action.payload;
    },
    hideMessage(state) {
      state.enable = false;
      state.message = '';
    },
  },
});

export const messageActions = messageSlice.actions;
export default messageSlice.reducer;

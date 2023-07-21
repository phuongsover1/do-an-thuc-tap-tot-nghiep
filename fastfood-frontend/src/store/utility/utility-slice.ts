import { createSlice } from '@reduxjs/toolkit';

type UsernamePayloadAction = {
  payload: string;
};
type UtilityState = {
  username: string;
};

const initialState: UtilityState = {
  username: '',
};

const utilitySlice = createSlice({
  name: 'utility',
  initialState,
  reducers: {
    setUsername(state, action: UsernamePayloadAction) {
      return { ...state, username: action.payload };
    },
  },
});

export const utilityActions = utilitySlice.actions;
export default utilitySlice.reducer;

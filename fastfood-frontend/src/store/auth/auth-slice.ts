import { createSlice } from '@reduxjs/toolkit';

type AuthPayloadAction = {
  payload: number;
};
type AuthState = {
  idAccount: number | null;
};

const initialState: AuthState = { idAccount: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin(state, action: AuthPayloadAction) {
      state.idAccount = action.payload;
    },
    setLogout(state) {
      state.idAccount = null;
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;

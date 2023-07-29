import { createSlice } from '@reduxjs/toolkit';

type UsernamePayloadAction = {
  payload: string;
};
type UtilityState = {
  username: string;
  checkoutAddress: string;
  checkoutPhoneNumber: string;
};

const initialState: UtilityState = {
  username: '',
  checkoutAddress: '',
  checkoutPhoneNumber: '',
};

const utilitySlice = createSlice({
  name: 'utility',
  initialState,
  reducers: {
    setUsername(state, action: UsernamePayloadAction) {
      return { ...state, username: action.payload };
    },
    setCheckoutAddress(state, action: { payload: string }) {
      state.checkoutAddress = action.payload;
    },
    setCheckoutPhoneNumber(state, action: { payload: string }) {
      state.checkoutPhoneNumber = action.payload;
    },
  },
});

export const utilityActions = utilitySlice.actions;
export default utilitySlice.reducer;

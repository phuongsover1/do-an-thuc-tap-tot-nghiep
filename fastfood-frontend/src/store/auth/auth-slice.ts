import { createSlice } from '@reduxjs/toolkit';

type AuthAccountIdPayloadAction = {
  payload: number;
};

type CartType = {
  productId: number;
  quantitty: number;
};

type AuthAccountCartPayloadAction = {
  payload: CartType[];
};

type AuthState = {
  idAccount: number | null;
  cart: CartType[];
};

const initialState: AuthState = { idAccount: null, cart: [] };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin(state, action: AuthAccountIdPayloadAction) {
      state.idAccount = action.payload;
    },
    setLogout(state) {
      state.idAccount = null;
    },
    setCart(state, action: AuthAccountCartPayloadAction) {
      state.cart = action.payload;
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;

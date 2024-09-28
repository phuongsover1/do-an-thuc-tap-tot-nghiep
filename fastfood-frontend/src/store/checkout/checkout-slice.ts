import { CheckoutType, PaymentMethodType } from '@/shared/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: CheckoutType = {
  accountId: 0,
  cart: [],
  notes: '',
  address: '',
  phoneNumber: '',
  paymentMethod: '',
  totalPrice: 0,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckout(state, action: { payload: CheckoutType }) {
      state.accountId = action.payload.accountId;
      state.totalPrice = action.payload.totalPrice;
      state.phoneNumber = action.payload.phoneNumber;
      state.address = action.payload.address;
      state.notes = action.payload.notes;
      state.cart = action.payload.cart;
    },
    clearCheckout(state) {
      state = initialState;
    },
    setPaymentMethod(state, action: { payload: PaymentMethodType }) {
      state.paymentMethod = action.payload;
    },
  },
});

export const checkoutActions = checkoutSlice.actions;
export default checkoutSlice.reducer;

import axiosInstance from '@/axios/axios';
import { createSlice } from '@reduxjs/toolkit';

type AuthAccountIdPayloadAction = {
  payload: number;
};

export type CartType = {
  productId: number;
  quantity: number;
};

type AuthAccountCartPayloadAction = {
  payload: CartType[];
};

type AuthState = {
  idAccount: number | null;
  cart: CartType[];
};

type AddProductToCartActionType = {
  payload: CartType;
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
    addProductToCart(state, action: AddProductToCartActionType) {
      const existProduct = state.cart.find(
        (productObj) => productObj.productId === action.payload.productId,
      );
      if (!existProduct) {
        state.cart.push({
          productId: action.payload.productId,
          quantity: action.payload.quantity,
        });
      } else {
        existProduct.quantity += action.payload.quantity;
      }
    },
    updateAccountCartInDb(state) {
      axiosInstance
        .post('/carts', {
          accountId: state.idAccount,
          cartProductDTOS: state.cart,
        })
        .then((response) => {
          const responseData = response.data as {
            isSuccessful?: boolean;
            error?: string;
          };
          if (responseData.isSuccessful) {
            console.log('Thêm cart product thành công');
          } else {
            console.log('Thêm cart product thất bại');
          }
        })
        .catch((err) => console.log('error: ', err));
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;

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
  roleName: 'USER' | 'ADMIN' | 'STAFF' | '';
};

type AddProductToCartActionType = {
  payload: { cartDetail: CartType; inDetailPage: boolean };
};

const initialState: AuthState = { idAccount: null, cart: [], roleName: '' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin(state, action: AuthAccountIdPayloadAction) {
      state.idAccount = action.payload;
    },
    setLogout(state) {
      state.idAccount = null;
      state.cart = [];
      state.roleName = '';
    },
    setRole(state, action: { payload: 'USER' | 'ADMIN' | 'STAFF' }) {
      state.roleName = action.payload;
    },
    setCart(state, action: AuthAccountCartPayloadAction) {
      state.cart = action.payload;
    },
    addProductToCart(state, action: AddProductToCartActionType) {
      const existProduct = state.cart.find(
        (productObj) =>
          productObj.productId === action.payload.cartDetail.productId,
      );
      if (!existProduct) {
        state.cart.push({
          productId: action.payload.cartDetail.productId,
          quantity: action.payload.cartDetail.quantity,
        });
      } else {
        if (action.payload.inDetailPage)
          existProduct.quantity = action.payload.cartDetail.quantity;
        else existProduct.quantity += action.payload.cartDetail.quantity;
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
    removeProductFromCart(state, action: { payload: { productId: number } }) {
      const { productId } = action.payload;
      const existIndex = state.cart.findIndex(
        (product) => product.productId === productId,
      );
      if (existIndex >= 0) {
        state.cart.splice(existIndex, 1);
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;

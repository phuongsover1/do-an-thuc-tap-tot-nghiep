import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './auth/auth-slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import UtilityReducer from './utility/utility-slice';

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    utility: UtilityReducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

export default store;

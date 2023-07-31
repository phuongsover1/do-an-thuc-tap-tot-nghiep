import { CartType } from '@/store/auth/auth-slice';

export type CheckoutType = {
  accountId: number;
  cart: CartType[];
  address: string;
  phoneNumber: string;
  notes: string;
  paymentMethod?: 'VietinBank' | 'ZaloPay' | 'MoMo' | 'ShopeePay';
  totalPrice: number;
};

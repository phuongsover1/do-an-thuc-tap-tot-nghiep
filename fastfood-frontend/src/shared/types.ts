import { CartType } from '@/store/auth/auth-slice';

export type PaymentMethodType = 'VietinBank' | 'ZaloPay' | 'MoMo' | 'ShopeePay' | '';

export type CheckoutType = {
  accountId: number;
  cart: CartType[];
  address: string;
  phoneNumber: string;
  notes: string;
  paymentMethod?: PaymentMethodType;
  totalPrice: number;
};


export type UserInfor = {
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
};

export type AccountInfo = {
  accountId: number;
  status: boolean;
};

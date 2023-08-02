import axiosInstance from '../axios';

export type PaymentConfirmationType = {
  billId: number;
  accountId: number;
};

export const paymentConfirmation = async (values: PaymentConfirmationType) => {
  const response = await axiosInstance.post(
    '/staffs/payment-confirmation',
    {},
    {
      params: {
        billId: values.billId,
        accountId: values.accountId,
      },
    },
  );
  return response.data as boolean;
};

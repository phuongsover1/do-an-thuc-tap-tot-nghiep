import axiosInstance from '../axios';

export interface BillHistory {
  billId: number;
  status: string;
  totalPrice: number;
  dateCreated: string;
  paymentMethod: string;
}

export const fetAllBills = async (accountId: number) => {
  const response = await axiosInstance.get('/bills', { params: { accountId } });
  return response.data as BillHistory[];
};

export type BillDetails = {
  productId: number;
  quantity: number;
};

export const fetchBillDetails = async (billId: number) => {
  const response = await axiosInstance.get('/bills/details', {
    params: { billId },
  });
  return response.data as BillDetails[];
};

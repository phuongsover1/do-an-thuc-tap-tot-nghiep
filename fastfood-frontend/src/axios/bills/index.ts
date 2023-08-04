import axiosInstance from '../axios';

export interface BillHistory {
  billId: number;
  status: string;
  totalPrice: number;
  dateCreated: string;
  paymentMethod: string;
}

export type Bill = {
  billId: number;
  notes: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  dateCreated: string;
  dateSuccessfullyPaid: string;
  qrPaymentPath: string;
};

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

export const fetchBill = async (billId: number) => {
  const response = await axiosInstance.get(`/bills/${billId}`);
  return response.data as Bill;
};

export const fetchWaitingBills = async () => {
  const response = await axiosInstance.get('/bills/waiting-bills');
  return response.data as BillHistory[];
};

export const fetchSuccessfulBills = async (accountId: number) => {
  const resnponse = await axiosInstance.get('/bills/successful-bills', {
    params: { accountId },
  });
  return resnponse.data as BillHistory[];
};

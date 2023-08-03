import { Staff } from '@/scenes/admin/staffs';
import axiosInstance from '../axios';

export type PaymentConfirmationType = {
  billId: number;
  accountId: number;
};

export type StaffInfor = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
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

export async function getStaffByAccountId(accountId: number) {
  const responese = await axiosInstance.get(
    '/staffs/find-staff-by-account-id',
    {
      params: { accountId },
    },
  );
  return responese.data as StaffInfor | null;
}

export type CheckEmailPhoneNumber = {
  email: string;
  phoneNumber: string;
};
export async function checkEmailPhoneNumber(
  values: CheckEmailPhoneNumber,
  accountId: number,
) {
  const response = await axiosInstance.get('/staffs/check-email-phone-number', {
    params: {
      email: values.email,
      phoneNumber: values.phoneNumber,
      accountId,
    },
  });
  return response.data as CheckEmailPhoneNumber;
}
export async function updateStaffInfoByAccount(
  staffInfo: StaffInfor,
  accountId: number,
) {
  const response = await axiosInstance.post(
    '/staffs/update-info-by-account',
    staffInfo,
    {
      params: {
        accountId,
      },
    },
  );
  return response.data as boolean;
}

export async function changePassword(values: {
  accountId: number;
  password: string;
  newPassword: string;
}) {
  const { accountId, password, newPassword } = values;
  const response = await axiosInstance.post(
    '/auth/change-password',
    { accountId, password },
    {
      params: {
        newPassword,
      },
    },
  );
  return response.data as { error?: string };
}

export async function fetchStaffs(isWorking: boolean) {
  const responese = await axiosInstance.get('/admins/staffs', {
    params: { isWorking },
  });
  return responese.data as Staff[];
}

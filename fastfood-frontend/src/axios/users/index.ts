import { AccountInfo, UserInfor } from '@/shared/types';
import axiosInstance from '../axios';
import { UserInfo } from '../admin';

export async function getUserByAccountId(accountId: number) {
  const responese = await axiosInstance.get('/users/find-user-by-account-id', {
    params: { accountId },
  });
  return responese.data as UserInfor | null;
}

export type CheckEmailPhoneNumber = {
  email: string;
  phoneNumber: string;
};
export async function checkEmailPhoneNumber(
  values: CheckEmailPhoneNumber,
  accountId: number,
) {
  const response = await axiosInstance.get('/users/check-email-phone-number', {
    params: {
      email: values.email,
      phoneNumber: values.phoneNumber,
      accountId,
    },
  });
  return response.data as CheckEmailPhoneNumber;
}
export async function updateUserInfoByAccount(
  userInfo: UserInfor,
  accountId: number,
) {
  const response = await axiosInstance.post(
    '/users/update-info-by-account',
    userInfo,
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

export async function fetchUserById(userId: string) {
  const response = await axiosInstance.get('/users/find-by-id', {
    params: { userId },
  });
  return response.data as UserInfo;
}

export async function fetchAccountByUserId(userId: string) {
  const responese = await axiosInstance.get('/users/find-account', {
    params: { userId },
  });
  return responese.data as AccountInfo;
}

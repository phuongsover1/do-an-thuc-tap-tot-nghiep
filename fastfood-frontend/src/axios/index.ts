import { AccountInfo } from '@/shared/types';
import axiosInstance from './axios';

export async function changeAccountStatus(accountId: number) {
  const response = await axiosInstance.post(
    '/auth/change-status',
    {},
    {
      params: {
        accountId,
      },
    },
  );
  return response.data as boolean;
}

export async function loginRequest(username: string, password: string) {
  const response = await axiosInstance.post('/auth/login', {
    username,
    password,
  });
  return response.data as AccountInfo;
}

export async function checkUsernameEmailPhoneNumber(
  username: string,
  email: string,
  phoneNumber: string,
) {
  const response = await axiosInstance.get(
    '/auth/check-username-email-phone-number',
    {
      params: {
        username,
        email,
        phoneNumber,
      },
    },
  );
  return response.data as {
    username: string;
    email: string;
    phoneNumber: string;
  };
}

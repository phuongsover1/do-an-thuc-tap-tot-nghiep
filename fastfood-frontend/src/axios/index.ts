import { AccountInfo } from '@/shared/types';
import axiosInstance from './axios';

export async function chageAccountStatus(accountId: number) {
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

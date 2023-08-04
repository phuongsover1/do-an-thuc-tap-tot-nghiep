import axiosInstance from '../axios';

export type CreateStaffType = {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  address: string;

  sex: boolean;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
};

export type UserInfo = {
  userId: string;
  firstName: string;
  lastName: string;
  sex: string;
  address: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
};
export async function createStaff(values: CreateStaffType) {
  const response = await axiosInstance.post('/admins/create-staff', values);
  return response.data as string | null;
}

export async function fetchUsers(isActive: boolean) {
  const response = await axiosInstance.get('/admins/users', {
    params: { isActive },
  });
  return response.data as UserInfo[];
}

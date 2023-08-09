import { UpdateProductFromApi } from '@/scenes/admin/crud/product/Product';
import axiosInstance from '../axios';
import { Staff } from '@/scenes/admin/staffs';

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
export async function createStaff(values: CreateStaffType, role: string) {
  const response = await axiosInstance.post('/admins/create-staff', values, {
    params: { role },
  });
  return response.data as string | null;
}

export async function fetchUsers(isActive: boolean) {
  const response = await axiosInstance.get('/admins/users', {
    params: { isActive },
  });
  return response.data as UserInfo[];
}

export async function fetchUpdateProduct(productId: number) {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data as UpdateProductFromApi;
}

export async function fetchAdmins(isWorking: boolean) {
  const responese = await axiosInstance.get('/admins', {
    params: { isWorking },
  });
  return responese.data as Staff[];
}

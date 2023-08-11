import axiosInstance from '../axios';
export type Supplier = {
  id: number;
  name: string;
  status: boolean;
};

export async function getAllSuppliersisActive() {
  const responseData = await axiosInstance.get('/suppliers', {
    params: { status: true },
  });
  return responseData.data as Supplier[];
}

export async function getAllSuppliers() {
  const responseData = await axiosInstance.get('/suppliers');
  return responseData.data as Supplier[];
}

export async function saveSupplier(name: string) {
  const responseData = await axiosInstance.post('/suppliers', { name });
  return responseData.data as boolean;
}

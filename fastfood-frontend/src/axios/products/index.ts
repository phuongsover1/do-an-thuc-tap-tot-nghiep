import axiosInstance from '../axios';

export async function deleteProductById(productId: number) {
  const response = await axiosInstance.post(
    '/products/delete',
    {},
    { params: { productId } },
  );
  return response.data as string;
}

import axiosInstance from '@/axios/axios';
import { BillDetails } from '@/axios/bills';
import { ProductFromApi } from '@/scenes/admin/crud/product/Product';
import { handleMoney } from '@/shared/Utils';
import { useAppDispatch } from '@/store';
import React, { useEffect, useState } from 'react';

type Props = {
  cartItem: BillDetails;
  isTop1: boolean;
};

const CartItem = ({ cartItem, isTop1 }: Props) => {
  const { productId, quantity } = cartItem;
  const [productImage, setProductImage] = useState('');
  const [product, setProduct] = useState<ProductFromApi | null>(null);

  useEffect(() => {
    async function getProductById(productId: number) {
      console.log('in get Product by id');

      const response = await axiosInstance.get(`/products/${productId}`);
      const data = response.data as ProductFromApi;
      setProduct(data);
      getProductImage(data);
    }
    if (productId) {
      try {
        void getProductById(productId);
      } catch (err) {
        console.log('error: ', err);
      }
    }
  }, [productId]);

  function getProductImage(product: ProductFromApi) {
    // get image from spring
    axiosInstance
      .get('/products/image', {
        params: {
          productId: product.id,
          imageName: 'anh 1',
        },
        responseType: 'blob',
      })
      .then((res) => {
        setProductImage(URL.createObjectURL(res.data as Blob | MediaSource));
      })
      .catch((err) => console.log(err));
  }

  return (
    <li
      className={`flex w-full justify-between py-5 ${
        !isTop1 ? 'border-t border-red-100' : ''
      }`}
    >
      <div className="left-div flex items-center gap-4">
        <img src={productImage} alt="" className="w-28" />
        <div className="details flex flex-col gap-1">
          <p className="text-base font-semibold text-slate-800 hover:text-red-400">
            {product?.name}
          </p>
          <p>
            {product && handleMoney(parseInt(product.price))}
            {' x'} {quantity} {' = '}
            {product && handleMoney(parseInt(product.price) * quantity)}
            <span className="underline underline-offset-1">đ</span>
          </p>
        </div>
      </div>

      <div className="right-div flex items-center gap-10">
        <div className="mr-8 flex items-center gap-2">
          <span className="text-sm">Số lượng:</span>
          <div className="relative flex h-8 w-8 justify-center rounded-md bg-red-100 text-center text-lg">
            <span className="self-center text-slate-700">{quantity}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;

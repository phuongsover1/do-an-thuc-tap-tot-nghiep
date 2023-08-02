import React, { useEffect, useState } from 'react';
import GaRanImage from '@/assets/K-Chicken.png';
import { ProductFromApi } from '@/scenes/admin/crud/product/Product';
import axiosInstance from '@/axios/axios';
import { useAppDispatch } from '@/store';
import { authActions } from '@/store/auth/auth-slice';
import { handleMoney } from './Utils';

type Props = {
  product: ProductFromApi;
};

const ProductCard = ({ product }: Props) => {
  const [productImage, setProductImage] = useState<string>('');
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    getProductImage(product);
  }, [product]);

  function addToCartHandler() {
    dispatch(
      authActions.addProductToCart({
        cartDetail: { productId: product.id, quantity: 1 },
        inDetailPage: false,
      }),
    );
    dispatch(authActions.updateAccountCartInDb());
  }

  return (
    <div className="rounded-lg shadow">
      <div className="flex flex-col">
        <img src={productImage} className="h-40 rounded-t-lg" alt="" />
      </div>
      <div className="p-3 pb-10">
        <p className="font-semibold text-slate-800">{product.name}</p>
        <p className="mt-2 text-2xl font-bold text-red-400">
          {handleMoney(product.price)} <span className="underline">đ</span>
        </p>
      </div>
      <div className="p-1">
        <button
          className="w-full rounded-sm bg-red-400 px-4 py-2 text-center text-white"
          onClick={addToCartHandler}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

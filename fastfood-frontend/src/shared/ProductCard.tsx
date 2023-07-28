import React, { useEffect, useState } from 'react';
import GaRanImage from '@/assets/K-Chicken.png';
import { ProductFromApi } from '@/scenes/admin/crud/product/Product';
import axiosInstance from '@/axios/axios';
import { useAppDispatch } from '@/store';
import { authActions } from '@/store/auth/auth-slice';

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
      authActions.addProductToCart({ productId: product.id, quantity: 1 }),
    );
    dispatch(authActions.updateAccountCartInDb());
  }

  return (
    <div className="shadow rounded-lg">
      <div className="flex flex-col">
        <img src={productImage} className="h-40 rounded-t-lg" alt="" />
      </div>
      <div className="p-3 pb-10">
        <p className="font-semibold text-slate-800">{product.name}</p>
        <p className="text-red-400 text-2xl font-bold mt-2">
          {product.price} đ
        </p>
      </div>
      <div className="p-1">
        <button
          className="text-white w-full text-center py-2 px-4 rounded-sm bg-red-400"
          onClick={addToCartHandler}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

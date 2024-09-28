import { ProductFromApi } from '@/scenes/admin/crud/product/Product';
import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import ProductImage from '@/assets/K-Chicken.png';
import { TrashIcon } from '@heroicons/react/24/outline';
import axiosInstance from '@/axios/axios';
import { useAppDispatch, useAppSelector } from '@/store';
import { authActions } from '@/store/auth/auth-slice';
import { useNavigate } from 'react-router-dom';
import { handleMoney } from './Utils';

type Props = {
  productId: number;
  isTop1?: boolean;
  quantity: number;
  updateTotalPrice: (price: number) => void;
  isLast: boolean;
};

const CartProduct = ({
  productId,
  isTop1,
  quantity,
  updateTotalPrice,
  isLast,
}: Props) => {
  const [product, setProduct] = useState<ProductFromApi | null>(null);
  const [productImage, setProductImage] = useState<string>('');
  const accountId = useAppSelector((state) => state.auth.idAccount);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      updateTotalPrice(parseInt(product.price) * quantity);
    }
  }, [product, quantity, updateTotalPrice]);

  if (isLast) {
    console.log('isLast: ', isLast);
  }

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

  async function getProductById(productId: number) {
    console.log('in get Product by id');

    const response = await axiosInstance.get(`/products/${productId}`);
    const data = response.data as ProductFromApi;
    setProduct(data);
  }
  useEffect(() => {
    void getProductById(productId);
  }, [productId]);

  useEffect(() => {
    if (product) getProductImage(product);
  }, [product]);

  async function removeProductFromCartHandler() {
    if (product) {
      try {
        const response = await axiosInstance.post('/carts/delete', {
          productId: product.id,
          accountId,
        });
        const isSuccessful = response.data as boolean;
        if (isSuccessful) {
          console.log('xoa san pham thanh cong');
          dispatch(
            authActions.removeProductFromCart({ productId: product.id }),
          );
        } else console.log('xoa san pham that bai');
      } catch (err) {
        console.log('error: ', err);
      }
    }
  }

  function navigateToProductDetails(productId: number) {
    navigate(`/product-details/${productId}`);
  }
  return (
    <li
      className={`flex items-center ${
        !isTop1 ? 'border-t' : ''
      } py-2 border-slate-200`}
    >
      <div
        className="flex gap-2 basis-4/5 cursor-pointer"
        onClick={() => navigateToProductDetails(productId)}
      >
        <img src={productImage} alt="" className="h-12 w-16" />
        <div>
          <p className="text-slate-800 font-semibold">{product?.name}</p>
          <p className="text-slate-800">
            {product && handleMoney(parseInt(product.price))} đ x {quantity}
          </p>
        </div>
      </div>
      <div className="basis-1/5 text-right">
        <button onClick={removeProductFromCartHandler}>
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </li>
  );
};

export default CartProduct;

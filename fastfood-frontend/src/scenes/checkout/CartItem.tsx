import axiosInstance from '@/axios/axios';
import { CartType, authActions } from '@/store/auth/auth-slice';
import React, { useEffect, useState } from 'react';
import { ProductFromApi } from '../admin/crud/product/Product';
import { useAppDispatch, useAppSelector } from '@/store';
import { TrashIcon } from '@heroicons/react/24/outline';
import { handleMoney } from '@/shared/Utils';
import { Link } from 'react-router-dom';
import { ClassNames } from '@emotion/react';

type Props = {
  cartItem: CartType;
  isTop1: boolean;
  updateTotalPrice: (plusPrice: number) => void;
};

const CartItem = ({ isTop1, cartItem, updateTotalPrice }: Props) => {
  const { productId, quantity } = cartItem;
  const [productImage, setProductImage] = useState('');
  const [product, setProduct] = useState<ProductFromApi | null>(null);
  const [productQuantity, setProductQuantity] = useState(quantity);
  const dispatch = useAppDispatch();
  const accountId = useAppSelector((state) => state.auth.idAccount);

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

  useEffect(() => {
    if (product) {
      updateTotalPrice(parseInt(product.price) * productQuantity);
    }
  }, [product, productQuantity, updateTotalPrice]);
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
    function addToCartHandler() {
      if (productId !== undefined) {
        try {
          dispatch(
            authActions.addProductToCart({
              cartDetail: {
                productId: productId,
                quantity: productQuantity,
              },
              inDetailPage: true,
            }),
          );
          dispatch(authActions.updateAccountCartInDb());
        } catch (err) {
          console.log('error: ', err);
        }
      }
    }
    void addToCartHandler();
  }, [productQuantity, productId, dispatch]);

  async function removeProductFromCartHandler() {
    console.log('inRemove');
    console.log(product);

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
  return (
    <li
      className={`w-full flex justify-between py-5 ${
        !isTop1 ? 'border-t border-red-100' : ''
      }`}
    >
      <div className="left-div flex gap-4 items-center">
        <Link to={`/product-details/${productId}`}>
          <img src={productImage} alt="" className="w-28" />
        </Link>
        <div className="details flex flex-col gap-1">
          <Link
            to={`/product-details/${productId}`}
            className="font-semibold text-slate-800 text-base hover:text-red-400"
          >
            {product?.name}
          </Link>
          <p>
            <span>{product && handleMoney(parseInt(product.price))}</span> x <span>{productQuantity} = </span>
            {product && handleMoney(parseInt(product.price) * productQuantity)}
            <span className="underline underline-offset-1">đ</span>
          </p>
        </div>
      </div>

      <div className="right-div items-center flex gap-10">
        <div className="flex items-center gap-2">
          <button
            disabled={productQuantity === 1}
            onClick={() => {
              setProductQuantity((prev) => prev - 1);
            }}
            className={`w-8 justify-center h-8 bg-red-300 rounded-md text-white text-lg text-center font-bold flex ${
              productQuantity > 1 ? 'hover:bg-red-400' : ''
            } `}
          >
            <span className="self-center">-</span>
          </button>
          <div className="relative w-8 justify-center h-8 bg-red-100 rounded-md text-lg text-center flex">
            <span className="self-center text-slate-700">
              {productQuantity}
            </span>
            <div className="absolute text-red-400 w-20 text-sm -top-6 -left-6">
              MAX: {product && product.stock}
            </div>
          </div>
          <button
            onClick={() => {
              setProductQuantity((prev) => prev + 1);
            }}
            className={`w-8 justify-center h-8 bg-red-300 rounded-md text-white text-lg text-center font-bold flex ${
              product?.stock === productQuantity ? '' : 'hover:bg-red-400'
            } `}
            disabled={product?.stock === productQuantity}
          >
            <span className="self-center">+</span>
          </button>
        </div>
        <div className="flex items-center">
          <button onClick={() => void removeProductFromCartHandler()}>
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;

import { ProductFromApi } from '@/scenes/admin/crud/product/Product';
import React, { Dispatch, useEffect, useState } from 'react';
import ProductImage from '@/assets/K-Chicken.png';
import { TrashIcon } from '@heroicons/react/24/outline';
import axiosInstance from '@/axios/axios';

type Props = {
  productId: number;
  isTop1?: boolean;
  quantity: number;
  updateTotalPrice: React.Dispatch<React.SetStateAction<number>>;
};

const CartProduct = ({
  productId,
  isTop1,
  quantity,
  updateTotalPrice,
}: Props) => {
  if (!isTop1) {
    isTop1 = false;
  }
  const [product, setProduct] = useState<ProductFromApi | null>(null);
  const [productImage, setProductImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      updateTotalPrice((price) => {
        const newPrice = product.price * quantity;
        return price + newPrice;
      });
    }
  }, [product, quantity, updateTotalPrice]);
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
  return (
    <li
      className={`flex items-center ${
        isTop1 ? 'border-t' : ''
      } py-2 border-slate-200`}
    >
      <div className="flex gap-2 basis-4/5">
        <img src={productImage} alt="" className="h-12 w-16" />
        <div>
          <p className="text-slate-800 font-semibold">{product?.name}</p>
          <p className="text-slate-800">
            {product?.price} đ x {quantity}
          </p>
        </div>
      </div>
      <div className="basis-1/5 text-right">
        <button>
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </li>
  );
};

export default CartProduct;

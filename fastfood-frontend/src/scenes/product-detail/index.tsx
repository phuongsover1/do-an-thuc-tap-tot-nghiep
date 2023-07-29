import React, { useEffect, useState } from 'react';
import { ProductFromApi } from '../admin/crud/product/Product';
import axiosInstance from '@/axios/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { authActions } from '@/store/auth/auth-slice';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { handleMoney } from '@/shared/Utils';

const ProductDetails = () => {
  const [productImage, setProductImage] = useState('');
  const [product, setProduct] = useState<ProductFromApi | null>(null);
  const { productId } = useParams();
  const [productQuantity, setProductQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
        void getProductById(parseInt(productId));
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

  function addToCartHandler() {
    if (productId !== undefined) {
      try {
        dispatch(
          authActions.addProductToCart({
            cartDetail: {
              productId: parseInt(productId),
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

  return (
    <div className="mt-40">
      <div className="max-w-5xl flex flex-row-reverse m-auto">
        <button
          className="flex items-center gap-1 text-red-500 font-semibold px-4 py-2 rounded-full shadow-md "
          onClick={() => navigate(-1)}
        >
          <ArrowLongLeftIcon className="w-5" />
          Quay lại
        </button>
      </div>
      <div className="container flex py-4 px-20 gap-20 m-auto max-w-5xl">
        <div className="basis-2/5">
          <img src={productImage} alt="" className="w-full" />
        </div>

        <div className="basis-3/5">
          <div className="flex gap-4 flex-col items-start">
            <p className="text-slate-700 text-3xl font-bold">{product?.name}</p>
            <p className="text-red-400 font-bold text-2xl">
              {product && handleMoney(product?.price)} đ
            </p>
            <div>
              <div className="flex gap-4 items-center">
                <span className="text-slate-700">Số lượng: </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={productQuantity === 1}
                    onClick={() => setProductQuantity((prev) => prev - 1)}
                    className={`w-12 justify-center h-12 bg-red-300 rounded-lg text-white text-lg text-center font-bold flex ${
                      productQuantity > 1 ? 'hover:bg-red-400' : ''
                    } `}
                  >
                    <span className="self-center">-</span>
                  </button>
                  <div className="w-12 justify-center h-12 bg-red-100 rounded-lg text-lg text-center flex">
                    <span className="self-center text-slate-700">
                      {productQuantity}
                    </span>
                  </div>
                  <button
                    onClick={() => setProductQuantity((prev) => prev + 1)}
                    className="w-12 justify-center h-12 bg-red-300 rounded-lg text-white text-lg text-center font-bold flex hover:bg-red-400"
                  >
                    <span className="self-center">+</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={addToCartHandler}
              className="px-8 py-2 mt-4 bg-red-500 rounded-lg text-white font-semibold text-lg hover:bg-red-400"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

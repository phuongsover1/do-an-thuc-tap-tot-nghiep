import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import axiosInstance from '@/axios/axios.ts';
import OtherInformationModal from '@/scenes/home/other-informations/OtherInformationModal.tsx';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Banner1 from '@/assets/banner-1.png';
import Banner2 from '@/assets/banner-2.jpg';
import Banner3 from '@/assets/banner-3.jpg';
import ProductList from '@/shared/ProductList';
import { ProductFromApi } from '../admin/crud/product/Product';

type Props = {};

const HomePage = (props: Props) => {
  const idAccount = useAppSelector((state) => state.auth.idAccount);
  const [enableForceUserTypeOtherInfor, setEnableForceUserTypeOtherInfor] =
    useState(false);

  const [products, setProducts] = useState<ProductFromApi[]>([]);

  async function getAllProducts() {
    try {
      const response = await axiosInstance.get('/products');
      const productArr = response.data as ProductFromApi[];
      console.log('productArr: ', productArr);

      setProducts(productArr);
    } catch (e) {
      console.log('error: ', e);
    }
  }

  useEffect(() => {
    void getAllProducts();
  }, []);

  function closeUserTypeOtherInfo() {
    setEnableForceUserTypeOtherInfor(false);
  }

  async function checkRegisterRecently(idAccount: number | null) {
    try {
      const response = await axiosInstance.get(
        '/auth/checkUserRegisterRecently',
        {
          params: {
            idAccount: idAccount,
          },
        },
      );
      const isRegisterRecently = (await response.data) as boolean;
      if (isRegisterRecently) {
        console.log('isRegister recently', isRegisterRecently);
        setEnableForceUserTypeOtherInfor(true);
      } else {
        console.log('isRegister recently', isRegisterRecently);
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }
  useEffect(() => {
    if (idAccount != null) {
      void checkRegisterRecently(idAccount);
    }
  }, [idAccount]);
  return (
    <div className="mt-10">
      <OtherInformationModal
        open={enableForceUserTypeOtherInfor}
        handleClose={closeUserTypeOtherInfo}
      />
      <Carousel
        className="mt-24"
        autoPlay={true}
        infiniteLoop={true}
        interval={3000}
      >
        <div>
          <img src={Banner1} />
        </div>
        <div>
          <img src={Banner2} />
        </div>
        <div>
          <img src={Banner3} />
        </div>
      </Carousel>
      <div className="bg-white">
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default HomePage;

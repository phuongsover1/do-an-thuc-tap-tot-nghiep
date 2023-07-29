import React, { memo, useEffect, useState } from 'react';
import MyCart from './MyCart';
import Information from './Information';
import TotalPrice from './TotalPrice';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { Formik } from 'formik';
import { PlusSmallIcon } from '@heroicons/react/24/outline';

const Checkout = () => {
  const myCart = useAppSelector((state) => state.auth.cart);
  const [cartLengthState, setCartLengthState] = useState(0);
  const [totalPriceState, setTotalPriceState] = useState(0);
  let totalPrice = 0;

  function updateTotalPrice(plusPrice: number) {
    console.log('totalPrice:', totalPrice);

    totalPrice += plusPrice;

    setTotalPriceState(totalPrice);
  }

  useEffect(() => {
    const cartLength = myCart.reduce((current, next) => {
      return current + next.quantity;
    }, 0);
    setCartLengthState(cartLength);
  }, [myCart.length]);

  return (
    <div className="pt-32 bg-[#fffcfe] min-h-screen">
      <div className="container mx-auto">
        <div className="flex gap-10">
          <div className="basis-2/3 ml-24">
            <div className="flex justify-between items-center mb-5">
              <p>
                <span className="font-semibold text-xl text-slate-800">
                  GIỎ HÀNG CỦA BẠN
                </span>
                &nbsp;&nbsp; ({cartLengthState} Sản phẩm)
              </p>
              <Link to={'/products'}>
                <button className="flex items-center gap-1 text-red-500 font-semibold px-4 py-2 rounded-full shadow-md ">
                  <PlusSmallIcon className="w-5" />
                  Thêm món ăn
                </button>
              </Link>
            </div>
            <MyCart cart={myCart} updateTotalPrice={updateTotalPrice} />
            <div className="mt-6">Notes</div>
          </div>
          <div className="basis-1/3 mr-24 flex flex-col gap-3">
            <Formik
              initialValues={{ address: '', phoneNumber: '' }}
              onSubmit={(values) => {
                console.log('Submit values: ', values);
              }}
              validate={(values) => {
                const errors = {} as { address: string; phoneNumber: string };
                if (!values.address.trim())
                  errors.address = 'Địa chỉ không được để trống';
                if (!values.phoneNumber.trim())
                  errors.phoneNumber = 'Số điện thoại không được để trống';
                return errors;
              }}
            >
              {(formikProps) => {
                const {
                  values,
                  getFieldProps,
                  touched,
                  errors,
                  handleSubmit,
                  setFieldValue,
                  handleBlur,
                } = formikProps;
                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Information
                      values={values}
                      errors={errors}
                      touched={touched}
                      getFieldProps={getFieldProps}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                    />
                    <TotalPrice totalPrice={totalPriceState} />
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

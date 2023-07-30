import React, { memo, useEffect, useRef, useState } from 'react';
import MyCart from './MyCart';
import Information from './Information';
import TotalPrice from './TotalPrice';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { Formik } from 'formik';
import { PlusSmallIcon } from '@heroicons/react/24/outline';
import { CartType } from '@/store/auth/auth-slice';
import * as Yup from 'yup';
import axiosInstance from '@/axios/axios';
import { checkoutActions } from '@/store/checkout/checkout-slice';
import PaymentMethods from './payment-methods';
import { log } from 'console';

const validationSchema = Yup.object({
  address: Yup.string().trim().required('Địa chỉ không được để trống'),
  phoneNumber: Yup.string()
    .matches(/^0[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ' })
    .required('Số điện thoại không được để trống'),
});
const Checkout = () => {
  const noteInputRef = useRef<HTMLInputElement | null>(null);
  const myCart = useAppSelector((state) => state.auth.cart);
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  const [cartLengthState, setCartLengthState] = useState(0);
  const [totalPriceState, setTotalPriceState] = useState(0);

  const { idAccount: accountId, cart } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
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

  // TODO: submit checkout implement, lúc này là chỉ nên lưu vào redux thôi, chỉ gửi về server sau khi chọn phương thức thanh toán
  function saveCheckoutToRedux(
    accountId: number,
    cart: CartType[],
    address: string,
    phoneNumber: string,
    notes: string,
    totalPrice: number,
  ) {
    console.log(accountId, cart, address, phoneNumber, notes, totalPriceState);

    dispatch(
      checkoutActions.setCheckout({
        accountId,
        cart,
        address,
        phoneNumber,
        notes,
        totalPrice,
      }),
    );
  }

  function closePaymentMethodModalHandler() {
    setOpenPaymentMethodModal(false);
  }

  return (
    <div className="pt-32 bg-[#fffcfe] min-h-screen">
      <PaymentMethods
        open={openPaymentMethodModal}
        closeModalHandler={closePaymentMethodModalHandler}
      />
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
            <div className="mt-6 p-4 bg-white rounded-lg shadow drop-shadow">
              <p className="text-slate-700 font-semibold text-lg mb-2">
                Ghi chú cho đơn hàng
              </p>
              <input
                type="text"
                className="w-full py-1 border-b border-red-400 focus:outline-none"
                placeholder="Vui lòng thêm lưu ý cho cửa hàng (nếu có)"
                ref={noteInputRef}
              />
            </div>
          </div>
          <div className="basis-1/3 mr-24 flex flex-col gap-3">
            <Formik
              initialValues={{ address: '', phoneNumber: '' }}
              onSubmit={(values) => {
                console.log('Submit values: ', values);

                if (accountId) {
                  if (noteInputRef.current) {
                    void saveCheckoutToRedux(
                      accountId,
                      cart,
                      values.address,
                      values.phoneNumber,
                      noteInputRef.current.value,
                      totalPriceState,
                    );
                    setOpenPaymentMethodModal(true);
                  }
                }
              }}
              validationSchema={validationSchema}
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

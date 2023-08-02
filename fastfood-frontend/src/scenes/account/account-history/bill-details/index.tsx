import { BillDetails, BillHistory, fetchBillDetails } from '@/axios/bills';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import MyCart from './my-cart';

const BillDetails = () => {
  const { billId } = useParams();
  const [myCart, setMyCart] = useState<BillDetails[]>([]);
  const [cartLengthState, setCartLengthState] = useState(0);

  useEffect(() => {
    const getBill = async (billId: number) => {};
  });

  useEffect(() => {
    const getMyCart = async (billId: number) => {
      const data = await fetchBillDetails(billId);
      setMyCart(data);
    };
    if (billId) void getMyCart(parseInt(billId));
  }, [billId]);

  useEffect(() => {
    const cartLength = myCart.reduce((current, next) => {
      return current + next.quantity;
    }, 0);
    setCartLengthState(cartLength);
  }, [myCart.length]);

  return (
    <div className="min-h-screen bg-[#fffcfe] pt-32">
      <div className="container mx-auto">
        <div className="flex gap-10">
          <div className="ml-24 basis-2/3">
            <div className="mb-5 flex items-center justify-between">
              <p>
                <span className="text-xl font-semibold text-slate-800">
                  GIỎ HÀNG CỦA BẠN
                </span>
                &nbsp;&nbsp; ({cartLengthState} Sản phẩm)
              </p>
              <Link to={'/products'}>
                <button className="flex items-center gap-1 rounded-full px-4 py-2 font-semibold text-red-500 shadow-md ">
                  <ArrowLongLeftIcon className="w-5" />
                  Quay lại
                </button>
              </Link>
            </div>
            <MyCart cart={myCart} />
            <div className="mt-6 rounded-lg bg-white p-4 shadow drop-shadow">
              <p className="mb-2 text-lg font-semibold text-slate-700">
                Ghi chú cho đơn hàng
              </p>
              <input
                type="text"
                className="w-full border-b border-red-400 py-1 focus:outline-none"
                placeholder="Vui lòng thêm lưu ý cho cửa hàng (nếu có)"
                ref={noteInputRef}
              />
            </div>
          </div>
          <div className="mr-24 flex basis-1/3 flex-col gap-3">
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

export default BillDetails;

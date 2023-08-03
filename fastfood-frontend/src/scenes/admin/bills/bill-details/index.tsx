import {
  Bill,
  BillDetails,
  BillHistory,
  fetchBill,
  fetchBillDetails,
} from '@/axios/bills';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MyCart from './my-cart';
import Information from './information';
import TotalPrice from './total-price';
import BillInfo from './bill-info';

const BillDetailsPageStaff = () => {
  const { billId } = useParams();
  const [myCart, setMyCart] = useState<BillDetails[]>([]);
  const [cartLengthState, setCartLengthState] = useState(0);
  const [bill, setBill] = useState<Bill | null>(null);
  console.log('bill: ', bill);

  useEffect(() => {
    const getBill = async (billId: number) => {
      const data = await fetchBill(billId);
      setBill(data);
    };
    try {
      if (billId) {
        void getBill(parseInt(billId));
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }, [billId]);

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
  const navigate = useNavigate();

  return (
    <div className="mt-10 min-h-screen bg-[#fffcfe]">
      <div className="container mx-auto">
        <div className="flex gap-10">
          <div className="ml-24 basis-2/3">
            <div className="mb-5 flex items-center justify-between">
              <p>
                <span className="text-xl font-semibold text-slate-800">
                  CHI TIẾT VẬT PHẨM TRONG HÓA ĐƠN
                </span>
                &nbsp;&nbsp; ({cartLengthState} Sản phẩm)
              </p>

              <button
                onClick={() => {
                  navigate(-1);
                }}
                className="flex items-center gap-1 rounded-full px-4 py-2 font-semibold text-red-500 shadow-md "
              >
                <ArrowLongLeftIcon className="w-5" />
                Quay lại
              </button>
            </div>
            <MyCart cart={myCart} />
            <div className="mt-6 rounded-lg bg-white p-4 shadow drop-shadow">
              <p className="mb-2 text-lg font-semibold text-slate-700">
                Ghi chú của đơn hàng
              </p>
              <p
                className="w-full border-b border-red-400 py-1 text-slate-500 focus:outline-none"
                placeholder="Vui lòng thêm lưu ý cho cửa hàng (nếu có)"
              >
                {bill && bill.notes
                  ? bill.notes
                  : 'Đơn hàng này không có ghi chú.'}
              </p>
            </div>
            <div className="mt-6 rounded-lg bg-white p-4 shadow drop-shadow">
              <p className="mb-2 text-lg font-semibold text-slate-700">
                Mã QR thanh toán của khách hàng
              </p>
              <p className="w-full border-b border-red-400 py-1 text-slate-500 focus:outline-none">
                {bill && bill.qrPaymentPath}
              </p>
            </div>
          </div>
          <div className="mr-24 flex basis-1/3 flex-col gap-3">
            <div className="flex flex-col gap-5">
              {bill && (
                <>
                  <BillInfo bill={bill} />
                  <Information
                    address={bill.address}
                    phoneNumber={bill.phoneNumber}
                  />
                  <TotalPrice totalPrice={bill.totalPrice} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsPageStaff;

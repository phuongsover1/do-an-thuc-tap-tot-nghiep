import BasicModal from '@/shared/BasicModal';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import ZaloPayLogo from '@/assets/Logo ZaloPay.svg';
import ShopeePayLogo from '@/assets/Logo ShopeePay.svg';
import MoMoLogo from '@/assets/Logo MoMo.svg';
import VietinBankLogo from '@/assets/Logo VietinBank .svg';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { checkoutActions } from '@/store/checkout/checkout-slice';
import { CheckoutType } from '@/shared/types';
import axiosInstance from '@/axios/axios';
import { log } from 'console';
import { authActions } from '@/store/auth/auth-slice';

type Props = {
  open: boolean;
  closeModalHandler: () => void;
};

const PaymentMethods = ({ open, closeModalHandler }: Props) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('ZaloPay');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accountId, cart, phoneNumber, address, notes, totalPrice } =
    useAppSelector((state) => state.checkout);

  function handleChange(event: SelectChangeEvent) {
    setPaymentMethod(event.target.value);
  }

  async function createBill(values: CheckoutType) {
    const response = await axiosInstance.post('/bills', values);
    const billId = response.data as number | null;
    return billId;
  }

  function toQrPageHandler() {
    const { payload: newestPaymentMethod } = dispatch(
      checkoutActions.setPaymentMethod(paymentMethod),
    );
    createBill({
      accountId,
      cart,
      notes,
      address,
      phoneNumber,
      paymentMethod: newestPaymentMethod,
      totalPrice,
    })
      .then((billId) => {
        dispatch(authActions.clearCart());
        if (billId) {
          navigate(`/checkout/qr-scan/${billId}`, { replace: true });
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  }

  return (
    <BasicModal
      haveCloseButton={false}
      open={open}
      closeModalHandler={closeModalHandler}
      width={400}
      p={'1rem 2rem'}
      borderRadius="10px"
    >
      <div>
        <div>
          <label
            className="text-slate-700 block mb-4 font-semibold text-lg"
            htmlFor="payment-methods"
          >
            Chọn phương thức thanh toán:{' '}
          </label>
          <Select
            labelId="payment-methods"
            id="demo-simple-select"
            value={paymentMethod}
            onChange={handleChange}
            className="w-full"
          >
            <MenuItem value={'ZaloPay'}>
              <div className="flex items-center gap-4">
                <img src={ZaloPayLogo} alt="" className="h-6" />
                <p>ZaloPay</p>
              </div>
            </MenuItem>
            <MenuItem value={'ShopeePay'}>
              <div className="flex items-center gap-4">
                <img src={ShopeePayLogo} alt="" className="h-6" />
                <p>ShopeePay</p>
              </div>
            </MenuItem>
            <MenuItem value={'MoMo'}>
              <div className="flex items-center gap-4">
                <img src={MoMoLogo} alt="" className="h-6" />
                <p>MoMo</p>
              </div>
            </MenuItem>
            <MenuItem value={'VietinBank'}>
              <div className="flex items-center gap-4">
                <img src={VietinBankLogo} className="h-6" alt="" />
                <p>VietinBank</p>
              </div>
            </MenuItem>
          </Select>
          <div className="mt-4 flex justify-end gap-6">
            <button
              onClick={toQrPageHandler}
              className="py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition duration-200"
            >
              Thanh toán
            </button>
            <button
              onClick={closeModalHandler}
              className="py-2 px-4 rounded-lg bg-white outline-red-400 text-red-400 border border-red-400 font-semibold hover:text-red-300 hover:border-red-300"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </BasicModal>
  );
};

export default PaymentMethods;

import axiosInstance from '@/axios/axios';
import { useAppDispatch, useAppSelector } from '@/store';
import { utilityActions } from '@/store/utility/utility-slice';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { InputProps } from '@mui/material';
import { log } from 'console';
import {
  FieldConfig,
  FieldInputProps,
  FormikErrors,
  FormikTouched,
  useFormik,
} from 'formik';
import React, { useEffect, useReducer, useRef, useState } from 'react';

type Props = {
  values: { address: string; phoneNumber: string };
  getFieldProps: <Value = any>(
    props: string | FieldConfig<Value>,
  ) => FieldInputProps<Value>;
  touched: FormikTouched<{
    address: string;
    phoneNumber: string;
  }>;
  errors: FormikErrors<{ address: string; phoneNumber: string }>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<{
    address: string;
    phoneNumber: string;
  }>>;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
};

type InformationFormState = {
  address: boolean;
  phoneNumber: boolean;
};

const informationReducers = (
  state: InformationFormState,
  action: {
    type:
      | 'updateAddress'
      | 'disableUpdateAddress'
      | 'updatePhoneNumber'
      | 'disableUpdatePhoneNumber';
  },
) => {
  const { type } = action;
  switch (type) {
    case 'updateAddress':
      return { ...state, address: true };
    case 'updatePhoneNumber':
      return { ...state, phoneNumber: true };
    case 'disableUpdateAddress':
      return { ...state, address: false };
    case 'disableUpdatePhoneNumber':
      return { ...state, phoneNumber: false };
  }
};

type User = {
  firstName: string;
  lastName: string;
  sex: string;
  address: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
};

async function getUserFromAccountId(accountId: number) {
  try {
    const response = await axiosInstance.get('/users/find-user-by-account-id', {
      params: { accountId: accountId },
    });
    const userInfor = response.data as User;
    return userInfor;
  } catch (err) {
    console.log('error: ', err);
  }
}
const initialInformationFormState: InformationFormState = {
  address: false,
  phoneNumber: false,
};
const Information = ({
  values,
  errors,
  touched,
  setFieldValue,
  getFieldProps,
  handleBlur,
}: Props) => {
  const [informationFormState, dispatch] = useReducer(
    informationReducers,
    initialInformationFormState,
  );
  const [user, setUser] = useState<User | null>(null);
  const accountId = useAppSelector((state) => state.auth.idAccount);

  useEffect(() => {
    if (accountId) {
      getUserFromAccountId(accountId)
        .then((userInfo) => {
          if (userInfo) setUser(userInfo);
        })
        .catch((error) => console.log('error: ', error));
    }
  }, [accountId, setUser]);
  const { checkoutAddress, checkoutPhoneNumber } = useAppSelector(
    (state) => state.utility,
  );

  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      if (checkoutAddress === '')
        void setFieldValue('address', user.address, true);
      else void setFieldValue('address', checkoutAddress);

      if (checkoutPhoneNumber === '')
        void setFieldValue('phoneNumber', user.phoneNumber, true);
      else void setFieldValue('phoneNumber', checkoutPhoneNumber);
    }
  }, [user, setFieldValue, checkoutAddress, checkoutPhoneNumber]);

  function updateAddressHandler() {
    if (informationFormState.address) {
      dispatch({ type: 'disableUpdateAddress' });
    } else dispatch({ type: 'updateAddress' });
  }

  function disableUpdateAddressHandler() {
    dispatch({ type: 'disableUpdateAddress' });
  }
  function updatePhoneNumberHandler(): void {
    if (!informationFormState.phoneNumber) {
      dispatch({ type: 'updatePhoneNumber' });
    } else dispatch({ type: 'disableUpdatePhoneNumber' });
  }

  function disableUpdatePhoneNumberHandler() {
    dispatch({ type: 'disableUpdatePhoneNumber' });
  }

  return (
    <div className="p-3 bg-white rounded-lg shadow">
      <p className="text-slate-500 text-sm">Giao hàng đến</p>
      <div className="flex gap-3">
        <textarea
          className={`font-semibold text-xl text-slate-700 px-1 py-2 border border-dashed ring-0 focus:outline-none ${
            informationFormState.address ? 'border-red-300' : 'border-white'
          }`}
          id="address"
          style={{ resize: 'none' }}
          cols={20}
          rows={4}
          disabled={!informationFormState.address}
          placeholder="Nhập địa chỉ nhận hàng"
          {...getFieldProps('address')}
          onBlur={(e) => {
            disableUpdateAddressHandler();
            handleBlur(e);
            reduxDispatch(utilityActions.setCheckoutAddress(e.target.value));
          }}
        ></textarea>
        <button
          type="button"
          className="self-start mt-2"
          onClick={updateAddressHandler}
        >
          <PencilSquareIcon className="w-6 h-6 text-red-400" />
        </button>
      </div>
      <div className="error text-red-400 mb-3 mt-2">
        {errors.address && touched.address && errors.address}
      </div>

      <p className="text-slate-500 text-sm">Số điện thoại</p>
      <div className="flex gap-3">
        <input
          className={`font-semibold w-full text-xl text-slate-700 px-1 py-2 border border-dashed ring-0 focus:outline-none ${
            informationFormState.phoneNumber ? 'border-red-300' : 'border-white'
          }`}
          id="phoneNumber"
          disabled={!informationFormState.phoneNumber}
          {...getFieldProps('phoneNumber')}
          onBlur={(e) => {
            disableUpdatePhoneNumberHandler();
            handleBlur(e);
            reduxDispatch(
              utilityActions.setCheckoutPhoneNumber(e.target.value),
            );
          }}
          placeholder="Nhập số điện thoại người nhận"
        />
        <button
          type="button"
          className="self-start mt-2"
          onClick={updatePhoneNumberHandler}
        >
          <PencilSquareIcon className="w-6 h-6 text-red-400" />
        </button>
      </div>
      <div className="error text-red-400 mb-3 mt-2">
        {errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}
      </div>
      <div className="pt-4 text-gray-500 text-sm text-center border-dashed border-t border-black mt-3 font-sans">
        Thời gian tiếp nhận đơn hàng trực tuyến từ 08:00
        <br /> đến 21:30 hằng ngày
      </div>
    </div>
  );
};

export default Information;

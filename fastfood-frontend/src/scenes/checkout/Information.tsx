import { useAppSelector } from '@/store';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import React, { useReducer, useRef } from 'react';

type Props = {};

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
const initialInformationFormState: InformationFormState = {
  address: false,
  phoneNumber: false,
};
const Information = (props: Props) => {
  const [informationFormState, dispatch] = useReducer(
    informationReducers,
    initialInformationFormState,
  );
  const accountId = useAppSelector((state) => state.auth.idAccount);

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

  console.log(informationFormState);

  return (
    <div className="p-3 bg-white rounded-lg shadow">
      <p className="text-slate-500 text-sm">Giao hàng đến</p>
      <div className="flex gap-3">
        <textarea
          name="address"
          className={`font-semibold text-base text-slate-700 px-1 py-2 border border-dashed ring-0 focus:outline-none ${
            informationFormState.address ? 'border-red-300' : 'border-white'
          }`}
          id="address"
          style={{ resize: 'none' }}
          cols={30}
          rows={4}
          disabled={!informationFormState.address}
          onBlur={disableUpdateAddressHandler}
          placeholder="Nhập địa chỉ nhận hàng"
        ></textarea>
        <button className="self-start mt-2" onClick={updateAddressHandler}>
          <PencilSquareIcon className="w-6 h-6 text-red-400" />
        </button>
      </div>

      <p className="text-slate-500 text-sm">Số điện thoại</p>
      <div className="flex gap-3">
        <input
          name="phoneNumber"
          className={`font-semibold w-full text-base text-slate-700 px-1 py-2 border border-dashed ring-0 focus:outline-none ${
            informationFormState.phoneNumber ? 'border-red-300' : 'border-white'
          }`}
          id="phoneNumber"
          disabled={!informationFormState.phoneNumber}
          onBlur={disableUpdatePhoneNumberHandler}
          placeholder="Nhập số điện thoại người nhận"
        />
        <button className="self-start mt-2" onClick={updatePhoneNumberHandler}>
          <PencilSquareIcon className="w-6 h-6 text-red-400" />
        </button>
      </div>
      <div className="pt-4 text-gray-500 text-sm text-center border-dashed border-t border-black mt-3 font-sans">
        Thời gian tiếp nhận đơn hàng trực tuyến từ 08:00
        <br /> đến 21:30 hằng ngày
      </div>
    </div>
  );
};

export default Information;

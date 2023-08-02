import React from 'react';

type Props = {
  phoneNumber: string;
  address: string;
};

const Information = ({ phoneNumber, address }: Props) => {
  return (
    <div className="rounded-lg bg-white p-3 shadow">
      <p className="text-sm text-slate-500">Giao hàng đến</p>
      <div className="flex gap-3">
        <textarea
          className={`border border-dashed border-white px-1 py-2 text-xl font-semibold text-slate-700 ring-0 focus:outline-none`}
          id="address"
          style={{ resize: 'none' }}
          cols={20}
          rows={4}
          disabled
          value={address}
        >
          {address}
        </textarea>
      </div>

      <p className="text-sm text-slate-500">Số điện thoại</p>
      <div className="flex gap-3">
        <input
          className={`w-full border border-dashed border-white px-1 py-2 text-xl font-semibold text-slate-700 ring-0 focus:outline-none`}
          id="phoneNumber"
          disabled
          value={phoneNumber}
        />
      </div>
    </div>
  );
};

export default Information;

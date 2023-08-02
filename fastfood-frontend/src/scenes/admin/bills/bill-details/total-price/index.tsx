import { handleMoney } from '@/shared/Utils';
import React from 'react';

type Props = {
  totalPrice: number;
};

const TotalPrice = ({ totalPrice }: Props) => {
  const totalPriceRender = handleMoney(totalPrice);
  return (
    <div className="rounded-lg bg-white p-3 font-medium text-slate-900 shadow">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span>Tổng cộng</span>
          <span>
            {totalPriceRender} <span className="underline">đ</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span>Phí giao hàng</span>
          <span>Miễn phí giao hàng</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-dashed border-red-500 py-2">
          <span className="font-bold text-black">Tổng cộng</span>
          <span className="text-lg font-bold text-red-500">
            {totalPriceRender} đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalPrice;

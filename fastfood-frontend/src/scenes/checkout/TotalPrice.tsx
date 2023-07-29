import { handleMoney } from '@/shared/Utils';
import React from 'react';

type Props = {
  totalPrice: number;
};

const TotalPrice = ({ totalPrice }: Props) => {
  const totalPriceRender = handleMoney(totalPrice);
  return (
    <div className="p-3 bg-white font-medium text-slate-900 shadow rounded-lg">
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
        <div className="flex justify-between py-2 mt-2 border-t border-dashed border-red-500">
          <span className="text-black font-bold">Tổng cộng</span>
          <span className="text-red-500 text-lg font-bold">
            {totalPriceRender} đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalPrice;

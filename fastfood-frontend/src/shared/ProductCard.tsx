import React from 'react';
import GaRanImage from '@/assets/K-Chicken.png';

type Props = {};

const ProductCard = (props: Props) => {
  return (
    <div className="shadow rounded-lg">
      <div className="flex flex-col">
        <img src={GaRanImage} className="w-full rounded-t-lg" alt="" />
      </div>
      <div className="p-3">
        <p className="font-semibold text-slate-800">Gà Rán (1 miếng)</p>
        <p className="text-red-400 text-2xl font-bold">34.000 đ</p>
      </div>
      <div className="p-3">
        <button className="w-full text-white text-center py-2 px-4 rounded-sm bg-red-400">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

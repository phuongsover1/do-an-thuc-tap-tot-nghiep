import { useAppSelector } from '@/store';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import React from 'react';

type Props = {
  cartIconClickedHandler: () => void;
  open: boolean;
};

const CartIcon = ({ cartIconClickedHandler, open }: Props) => {
  const idAccount = useAppSelector((state) => state.auth.idAccount);
  return (
    <>
      <button
        productCount={3}
        className={`rounded-full p-2 shadow shadow-gray-300 relative  before:rounded-full ${
          idAccount !== null
            ? 'before:content-[attr(productCount)] before:w-5 before:h-5'
            : ''
        }  before:absolute before:text-white before:-top-1 before:-right-1 before:z-10 before:bg-red-400 before:text-sm`}
        onClick={cartIconClickedHandler}
      >
        <ShoppingBagIcon className="w-6 text-gray-500" />
      </button>
      {idAccount !== null && open && (
        <div className="absolute -left-64 top-20 w-96 rounded-lg bg-white drop-shadow-xl shadow-lg before:absolute before:-top-2 before:left-[16.6rem] before:z-0 before:h-5 before:w-5 before:rotate-45 before:bg-white before:text-white before:content-['dffd']">
          <ul className="flex flex-col gap-2 text-slate-600 my-4">
            <li className="gap-2 text-center w-full">
              Hiện không có gì trong giỏ hàng
            </li>
          </ul>
          <div className="flex items-center justify-between gap-2 border-t border-black py-4 px-4">
            <span className="text-slate-700 text-lg font-semibold">
              Tổng cộng
            </span>
            <span className="text-xl font-bold text-red-400">0 Đ</span>
          </div>

          <button className="w-full bg-red-400 text-white hover:bg-red-500 text-lg font-bold p-4 rounded-b-lg">
            THANH TOÁN
          </button>
        </div>
      )}
    </>
  );
};

export default CartIcon;

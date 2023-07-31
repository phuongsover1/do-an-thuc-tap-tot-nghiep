import { useAppSelector } from '@/store';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import CartProduct from './CartProduct';
import { useNavigate } from 'react-router-dom';
import { handleMoney } from './Utils';

type Props = {
  cartIconClickedHandler: () => void;
  open: boolean;
};

const CartIcon = ({ cartIconClickedHandler, open }: Props) => {
  const idAccount = useAppSelector((state) => state.auth.idAccount);
  const cart = useAppSelector((state) => state.auth.cart);
  let totalPrice = 0;
  const [totalPriceState, setTotalPriceState] = useState(0);

  const navigate = useNavigate();

  function updateTotalPrice(plusPrice: number) {
    console.log('totalPrice:', totalPrice);

    totalPrice += plusPrice;

    setTotalPriceState(totalPrice);
  }

  let cartLength = 0;
  for (let i = 0; i < cart.length; i++) {
    cartLength += cart[i].quantity;
  }

  return (
    <>
      <button
        productCount={cartLength}
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
          <ul className="flex flex-col gap-2 text-slate-600 my-4 pt-1 px-3 max-h-[230px] overflow-auto">
            {cartLength === 0 ? (
              <li className="gap-2 text-center w-full">
                Hiện không có gì trong giỏ hàng
              </li>
            ) : (
              cart.map((product, index) => (
                <CartProduct
                  key={product.productId}
                  isTop1={index === 0}
                  productId={product.productId}
                  quantity={product.quantity}
                  updateTotalPrice={updateTotalPrice}
                  isLast={index === cart.length - 1}
                />
              ))
            )}
          </ul>
          <div className="flex items-center justify-between gap-2 border-t border-black py-4 px-4">
            <span className="text-slate-700 text-lg font-semibold">
              Tổng cộng
            </span>
            <span className="text-xl font-bold text-red-400">
              {cart.length === 0 && 0}
              {cart.length > 0 && handleMoney(totalPriceState)}
              <span className="underline">đ</span>
            </span>
          </div>

          {cartLength !== 0 && (
            <button
              onClick={() => {
                navigate('/checkout');
              }}
              className="w-full bg-red-400 text-white hover:bg-red-500 text-lg font-bold p-4 rounded-b-lg"
            >
              THANH TOÁN
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CartIcon;

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
        className={`relative rounded-full p-2 shadow shadow-gray-300  before:rounded-full ${
          idAccount !== null
            ? 'before:h-5 before:w-5 before:content-[attr(productCount)]'
            : ''
        }  before:absolute before:-right-1 before:-top-1 before:z-10 before:bg-red-400 before:text-sm before:text-white`}
        onClick={cartIconClickedHandler}
      >
        <ShoppingBagIcon className="w-6 text-gray-500" />
      </button>
      {idAccount !== null && open && (
        <div className="absolute -left-64 top-20 w-96 rounded-lg bg-white shadow-lg drop-shadow-xl before:absolute before:-top-2 before:left-[16.6rem] before:z-0 before:h-5 before:w-5 before:rotate-45 before:bg-white before:text-white before:content-['dffd']">
          <ul className="my-4 flex max-h-[230px] flex-col gap-2 overflow-auto px-3 pt-1 text-slate-600">
            {cartLength === 0 ? (
              <li className="w-full gap-2 text-center">
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
          <div className="flex items-center justify-between gap-2 border-t border-black px-4 py-4">
            <span className="text-lg font-semibold text-slate-700">
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
                cartIconClickedHandler();
                navigate('/checkout');
              }}
              className="w-full rounded-b-lg bg-red-400 p-4 text-lg font-bold text-white hover:bg-red-500"
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

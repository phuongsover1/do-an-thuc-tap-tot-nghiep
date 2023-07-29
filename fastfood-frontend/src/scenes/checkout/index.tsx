import React, { useEffect, useState } from 'react';
import MyCart from './MyCart';
import Information from './Information';
import TotalPrice from './TotalPrice';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';

const Checkout = () => {
  const myCart = useAppSelector((state) => state.auth.cart);
  const [cartLengthState, setCartLengthState] = useState(0);
  const [totalPriceState, setTotalPriceState] = useState(0);
  let totalPrice = 0;

  function updateTotalPrice(plusPrice: number) {
    console.log('totalPrice:', totalPrice);

    totalPrice += plusPrice;

    setTotalPriceState(totalPrice);
  }

  useEffect(() => {
    const cartLength = myCart.reduce((current, next) => {
      return current + next.quantity;
    }, 0);
    setCartLengthState(cartLength);
  }, [myCart.length]);

  return (
    <div className="pt-32 bg-[#fffcfe] min-h-screen">
      <div className="container mx-auto">
        <div className="flex gap-10">
          <div className="basis-2/3 ml-24">
            <div className="flex justify-between mb-5">
              <p>
                <span className="font-semibold text-xl text-slate-800">
                  GIỎ HÀNG CỦA BẠN
                </span>
                &nbsp;&nbsp; ({cartLengthState} Sản phẩm)
              </p>
              <Link to={'/products'}>+ Thêm món ăn</Link>
            </div>
            <MyCart cart={myCart} updateTotalPrice={updateTotalPrice} />
            <div className="mt-6">Notes</div>
          </div>
          <div className="basis-1/3 mr-24 flex flex-col gap-3">
            <Information />
            <TotalPrice totalPrice={totalPriceState} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

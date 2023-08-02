import { BillDetails } from '@/axios/bills';
import React from 'react';
import CartItem from './cart-item';

type Props = {
  cart: BillDetails[];
};

const myCart = ({ cart }: Props) => {
  return (
    <ul className="w-full">
      {cart.length === 0 && <p>Giỏ hàng đang trống. Hãy mua hàng trước</p>}
      {cart.map((item, index) => (
        <CartItem key={index} isTop1={index === 0} cartItem={item} />
      ))}
    </ul>
  );
};

export default myCart;

import { CartType } from '@/store/auth/auth-slice';
import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

type Props = {
  cart: CartType[];
  updateTotalPrice: (plusPrice: number) => void;
};

const MyCart = ({ cart, updateTotalPrice }: Props) => {
  return (
    <ul className="w-full">
      {cart.length === 0 && <p>Giỏ hàng đang trống. Hãy mua hàng trước</p>}
      {cart.map((item, index) => (
        <CartItem
          key={index}
          isTop1={index === 0}
          cartItem={item}
          updateTotalPrice={updateTotalPrice}
        />
      ))}
    </ul>
  );
};

export default MyCart;

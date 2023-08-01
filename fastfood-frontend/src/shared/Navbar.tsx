import { useReducer, useState } from 'react';
import logo from '@/assets/lotteria_logo.svg';
import { motion } from 'framer-motion';
import {
  Bars3Icon,
  BellIcon,
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import useMediaQuery from '@/hooks/useMediaQuery';
import LoginModal from '@/scenes/home/LoginModal';
import { useAppSelector } from '@/store';
import CartIcon from './CartIcon';
import UserIconComponent from './UserIconComponent';
import { Link } from 'react-router-dom';

type ClickedIconStateType = {
  user?: boolean;
  cart?: boolean;
};

type ClickedIconActionType = {
  type: 'user' | 'cart' | 'nothing';
};
function clickedIconReducer(
  _state: ClickedIconStateType,
  action: ClickedIconActionType,
): ClickedIconStateType {
  switch (action.type) {
    case 'user':
      return { user: true };
    case 'cart':
      return { cart: true };
    case 'nothing':
      return {};
  }
}

const Navbar = () => {
  const isAboveMediumScreen = useMediaQuery('(min-width: 1060px)');
  const [isMenuToggled, setMenuToggled] = useState(false);
  const [isLoginModalOpened, setIsLoginModalOpened] = useState<boolean>(false);
  const [clickedIconState, setClickedIconState] = useReducer(
    clickedIconReducer,
    { cart: false, user: false },
  );
  const idAccount = useAppSelector((state) => state.auth.idAccount);

  const userIconClickedHandler = () => {
    if (idAccount !== null) {
      if (!clickedIconState.user) setClickedIconState({ type: 'user' });
      else setClickedIconState({ type: 'nothing' });
    } else {
      setIsLoginModalOpened(true);
    }
  };

  function cartIconClickedHandler() {
    if (idAccount !== null) {
      if (!clickedIconState.cart) setClickedIconState({ type: 'cart' });
      else setClickedIconState({ type: 'nothing' });
    } else {
      setIsLoginModalOpened(true);
    }
  }
  const closeLoginModal = () => {
    setIsLoginModalOpened(false);
  };

  return (
    <div>
      {idAccount === null && (
        <LoginModal open={isLoginModalOpened} handleClose={closeLoginModal} />
      )}
      <nav className="fixed left-0 top-0 z-50 w-full shadow">
        <div className="w-full bg-white">
          <div className="mx-auto flex h-16 max-w-3xl place-content-between items-center px-4 py-2 md:h-24 md:max-w-none md:px-24">
            <div className="flex items-center">
              <Link to={'/'}>
                <img className="w-11 md:w-16" src={logo} alt="" />
              </Link>
              {isAboveMediumScreen && (
                <ul className="mx-8 my-3 flex gap-5 px-3">
                  <li className=" text-base font-bold text-black">
                    BESTSELLER
                  </li>
                  <li className=" text-base font-bold text-black">Order Now</li>
                  <li className=" text-base font-bold text-black ">Birthday</li>
                  <li className=" text-base font-bold text-black">Store</li>
                </ul>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full p-2 shadow shadow-gray-300">
                <MapPinIcon className="w-6 text-gray-500" />
              </button>
              <div className="relative z-50">
                <UserIconComponent
                  userIconClickedHandler={userIconClickedHandler}
                  open={clickedIconState.user === true}
                />
              </div>

              <button className="rounded-full p-2 shadow shadow-gray-300">
                <BellIcon className="w-6 text-gray-500" />
              </button>
              <div className="relative z-50">
                <CartIcon
                  cartIconClickedHandler={cartIconClickedHandler}
                  open={clickedIconState.cart === true}
                />
              </div>
              {!isAboveMediumScreen && (
                <button onClick={() => setMenuToggled(true)}>
                  <Bars3Icon className="w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
        {!isAboveMediumScreen && isMenuToggled && (
          <motion.div
            transition={{ duration: 0.25 }}
            initial="close"
            viewport={{ once: false }}
            animate={isMenuToggled ? 'open' : 'close'}
            variants={{
              open: { opacity: 1, x: '0' },
              close: { opacity: 0, x: '100%' },
            }}
            className="fixed left-0 top-0 z-10 h-full w-full bg-white "
          >
            <div>
              <div className="flex place-content-between px-3">
                <img src={logo} alt="logo" className="w-20 rounded-b-lg" />
                <button onClick={() => setMenuToggled(false)}>
                  <XMarkIcon className="w-8 text-gray-500" />
                </button>
              </div>
              <ul className="my-3 px-3">
                <li className="border-b border-zinc-300 py-2 text-base text-slate-600">
                  BESTSELLER
                </li>
                <li className="border-b border-zinc-300 py-2 text-base text-slate-600">
                  Order Now
                </li>
                <li className="border-b border-zinc-300 py-2 text-base text-slate-600">
                  Birthday
                </li>
                <li className="border-b border-zinc-300 py-2 text-base text-slate-600">
                  Store
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

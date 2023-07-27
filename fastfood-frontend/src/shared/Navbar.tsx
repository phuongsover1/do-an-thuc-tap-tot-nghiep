import React, { useState } from 'react';
import logo from '@/assets/lotteria_logo.svg';
import { motion } from 'framer-motion';
import {
  Bars3Icon,
  BellIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  DocumentTextIcon,
  PowerIcon,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';
import useMediaQuery from '@/hooks/useMediaQuery';
import LoginModal from '@/scenes/home/LoginModal';
import { useAppSelector } from '@/store';

type Props = {};

const Navbar = (props: Props) => {
  const isAboveMediumScreen = useMediaQuery('(min-width: 1060px)');
  const [isMenuToggled, setMenuToggled] = useState(false);
  const [isUserIconClicked, setIsUserIconClicked] = useState<boolean>(false);
  const [isLoginModalOpened, setIsLoginModalOpened] = useState<boolean>(false);
  const [enableUserInfor, setEnableUserInfo] = useState(false);
  const idAccount = useAppSelector((state) => state.auth.idAccount);

  const userIconClickedHandler = () => {
    if (idAccount !== null) {
      if (!enableUserInfor) setEnableUserInfo(true);
      else setEnableUserInfo(false);
    } else {
      setIsLoginModalOpened(true);
    }
  };
  const closeLoginModal = () => {
    setIsLoginModalOpened(false);
  };

  return (
    <div>
      {idAccount === null && (
        <LoginModal open={isLoginModalOpened} handleClose={closeLoginModal} />
      )}
      <nav className="z-50 fixed top-0 left-0 w-full">
        <div className="w-full bg-white">
          <div className="mx-auto flex h-16 max-w-3xl place-content-between items-center px-4 py-2 md:h-24 md:max-w-none md:px-24">
            <div className="flex items-center">
              <img className="w-11 md:w-16" src={logo} alt="" />
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
                <button
                  className="rounded-full p-2 shadow shadow-gray-300"
                  onClick={userIconClickedHandler}
                >
                  <UserIcon className="w-6 text-gray-500" />
                </button>
                {idAccount !== null && enableUserInfor && (
                  <div className="absolute -left-24 top-20 w-60 rounded-lg bg-white p-6 drop-shadow-xl before:absolute before:-top-2 before:left-[6.5rem] before:z-0 before:h-5 before:w-5 before:rotate-45 before:bg-white before:text-white before:content-['dffd']">
                    <ul className="flex flex-col gap-2 text-slate-600">
                      <li className="flex items-center gap-2">
                        <span>
                          <UserIconSolid className="h-6 w-6" />
                        </span>
                        <span>Account Information</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>
                          <DocumentTextIcon className="h-6 w-6" />
                        </span>
                        <span>Order History</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>
                          <PowerIcon className="h-6 w-6" />
                        </span>
                        <span>Sign out</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <button className="rounded-full p-2 shadow shadow-gray-300">
                <BellIcon className="w-6 text-gray-500" />
              </button>
              <div className="relative z-50">
                <button className="rounded-full p-2 shadow shadow-gray-300">
                  <ShoppingBagIcon className="w-6 text-gray-500" />
                </button>
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

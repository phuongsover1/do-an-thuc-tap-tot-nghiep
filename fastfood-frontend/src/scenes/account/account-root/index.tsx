import {
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

type Props = {};

const AccountRoot = (props: Props) => {
  const { pathname } = useLocation();
  const active = pathname.substring(pathname.lastIndexOf('/') + 1);
  console.log('active: ', active);

  return (
    <div className="flex container mt-40 max-w-4xl m-auto rounded-lg shadow">
      <div className="sidebar basis-80 bg-red-400  rounded-l-lg text-white">
        <p className="p-5">LE NGUYEN DUY PHUONG</p>
        <ul className="">
          <Link to={'/account/info'}>
            <li
              className={`flex gap-3 items-center p-3 hover:bg-red-300 ${
                active === 'info' ? 'bg-red-300' : ''
              }`}
            >
              <UserIcon className="w-6 h-6" /> <span>Thông tin tài khoản</span>
            </li>
          </Link>
          <Link to={'/account/history'}>
            <li
              className={`flex gap-3 items-center p-3 hover:bg-red-300 ${
                active === 'history' ? 'bg-red-300' : ''
              }`}
            >
              <DocumentTextIcon className="w-6 h-6" />{' '}
              <span>Lịch sử đơn hàng</span>
            </li>
          </Link>
          <Link to={'/'}>
            <li className="flex gap-3 items-center p-3 hover:bg-red-300 rounded-l-lg rounded-t-none">
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />{' '}
              <span>Đăng xuất</span>
            </li>
          </Link>
        </ul>
      </div>

      <div className="w-full pl-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountRoot;

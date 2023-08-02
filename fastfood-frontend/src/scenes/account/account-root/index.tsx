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
    <div className="container m-auto mb-10 mt-32 flex max-w-7xl rounded-lg shadow">
      <div className="sidebar basis-80 rounded-l-lg  bg-red-400 text-white">
        <p className="p-5">LE NGUYEN DUY PHUONG</p>
        <ul className="">
          <Link to={'/account/info'}>
            <li
              className={`flex items-center gap-3 p-3 hover:bg-red-300 ${
                active === 'info' ? 'bg-red-300' : ''
              }`}
            >
              <UserIcon className="h-6 w-6" /> <span>Thông tin tài khoản</span>
            </li>
          </Link>
          <Link to={'/account/history'}>
            <li
              className={`flex items-center gap-3 p-3 hover:bg-red-300 ${
                active === 'history' ? 'bg-red-300' : ''
              }`}
            >
              <DocumentTextIcon className="h-6 w-6" />{' '}
              <span>Lịch sử đơn hàng</span>
            </li>
          </Link>
          <Link to={'/'}>
            <li className="flex items-center gap-3 rounded-l-lg rounded-t-none p-3 hover:bg-red-300">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />{' '}
              <span>Đăng xuất</span>
            </li>
          </Link>
        </ul>
      </div>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountRoot;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from '@/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from '@/routes/root.tsx';
import HomePage from '@/scenes/home';
import Product from '@/scenes/admin/crud/product/Product.tsx';
import AdminRoot from '@/routes/admin/root.tsx';
import Category from '@/scenes/admin/crud/category/Category.tsx';
import ProductDetails from './scenes/product-detail';
import Checkout from './scenes/checkout';
import QRScan from './scenes/checkout/QRScan';
import AccountRoot from './scenes/account/account-root';
import AccountInfo from './scenes/account/account-info';
import AccountHistory from './scenes/account/account-history';
import BillDetailsPage from './scenes/account/account-history/bill-details';

import Bills from './scenes/admin/bills';
import BillDetailsPageStaff from './scenes/admin/bills/bill-details';
import Information from './scenes/admin/info';
import SuccessfulBills from './scenes/admin/successfull-bills';
import Staffs from './scenes/admin/staffs';
import StaffDetails from './scenes/admin/staffs/staff-details';
import CreateStaff from './scenes/admin/staffs/create-staff';
import Users from './scenes/admin/users';
import UserDetails from './scenes/admin/users/user-details';
import Suppliers from './scenes/admin/suppliers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'product-details/:productId',
        element: <ProductDetails />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'account',
        element: <AccountRoot />,
        children: [
          {
            path: 'info',
            element: <AccountInfo />,
          },
          { path: 'history', element: <AccountHistory /> },
        ],
      },
      {
        path: '/account/history/details/:billId',
        element: <BillDetailsPage />,
      },
    ],
  },

  {
    path: 'checkout/qr-scan/:billId',
    element: <QRScan />,
  },
  {
    path: '/admin',
    element: <AdminRoot />,
    children: [
      {
        path: 'products',
        element: <Product />,
      },
      {
        path: 'categories',
        element: <Category />,
      },
      {
        path: 'staffs/:isWorking',
        element: <Staffs isAdmin={false} />,
      },
      {
        path: 'admins/:isWorking',
        element: <Staffs isAdmin={true} />,
      },
      {
        path: 'users/:isActive',
        element: <Users />,
      },
      {
        path: 'suppliers',
        element: <Suppliers />,
      },
    ],
  },
  {
    path: '/staff',
    element: <AdminRoot />,
    children: [
      {
        path: 'products',
        element: <Product />,
      },
      {
        path: 'bills',
        element: <Bills />,
      },
      {
        path: 'bills/successful-bills',
        element: <SuccessfulBills />,
      },
      {
        path: 'info',
        element: <Information />,
      },
    ],
  },
  {
    path: '/staff/bills/details/:billId',
    element: <BillDetailsPageStaff />,
  },
  {
    path: '/staff/bills/successful-bills/details/:billId',
    element: <BillDetailsPageStaff />,
  },
  {
    path: '/admin/staffs/details/:id',
    element: <StaffDetails />,
  },
  {
    path: '/admin/staffs/new',
    element: <CreateStaff isAdmin={false} />,
  },
  {
    path: '/admin/admins/new',
    element: <CreateStaff isAdmin={true} />,
  },
  {
    path: '/admin/users/details/:id',
    element: <UserDetails />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

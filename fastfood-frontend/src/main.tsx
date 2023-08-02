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
    ],
  },
  {
    path: '/staff/bills/details/:billId',
    element: <BillDetailsPageStaff />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

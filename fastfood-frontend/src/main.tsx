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
    ],
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

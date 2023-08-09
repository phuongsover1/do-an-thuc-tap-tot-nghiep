import axiosInstance from '@/axios/axios.ts';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars.tsx';
import { useAppDispatch } from '@/store';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { CartType, authActions } from '@/store/auth/auth-slice.ts';
import { Message } from '@/shared/MessageType.ts';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '@/axios';
import { BlockEnable } from '../LoginModal';

type LoginError = {
  username?: string;
  password?: string;
};

type Props = {
  setIsLoginBlockEnable: React.Dispatch<React.SetStateAction<BlockEnable>>;
};

const Login = ({ setIsLoginBlockEnable }: Props) => {
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const enableRegisterBlock = () => {
    setIsLoginBlockEnable({ register: true });
  };

  const enableForgotPasswordBlock = () => {
    setIsLoginBlockEnable({ forgotPassword: true });
  };

  const formikLogin = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      login(values.username, values.password);
    },
    validate: (values) => {
      const errors: LoginError = {};
      if (!values.username) {
        errors.username = 'Tên tài khoản không được để trống';
      }
      if (!values.password) {
        errors.password = 'Mật khẩu không được để trống';
      }
      return errors;
    },
  });

  async function getRoleFromAccountId(accountId: number) {
    try {
      const response = await axiosInstance.get('/auth/role', {
        params: { accountId },
      });
      const role = response.data as {
        id: number;
        name: 'USER' | 'ADMIN' | 'STAFF';
      } | null;
      if (role) {
        dispatch(authActions.setRole(role.name));
        // TODO: Chuyển trang
        if (role.name === 'ADMIN') {
          navigate('/admin');
        }

        if (role.name === 'STAFF') navigate('/staff');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  const login = async (username: string, password: string) => {
    const responseData = await loginRequest(username, password);
    if (responseData) {
      if (!responseData.status) {
        setMessage({ type: 'error', message: 'Tài khoản đã bị khóa !' });
        setMessageEnable(true);
        return;
      }
      setMessage({ type: 'success', message: 'Đăng nhập thành công' });

      setTimeout(() => {
        dispatch(authActions.setLogin(responseData.accountId));
        void getRoleFromAccountId(responseData.accountId);

        axiosInstance
          .get('/carts', { params: { accountId: responseData.accountId } })
          .then((response) => {
            const data = response.data as CartType[];
            dispatch(authActions.setCart(data));
          })
          .catch((error) => console.log('error: ', error));
      }, 2000);
    } else {
      setMessage({
        type: 'error',
        message: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }
    setMessageEnable(true);
  };
  return (
    <div>
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <p className="text-lg font-bold">Đăng nhập hoặc tạo tài khoản</p>

      <form className="my-3" onSubmit={formikLogin.handleSubmit}>
        <label htmlFor="username" className="font-bold">
          Tên tài khoản
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="mt-1 w-full rounded-md border border-pink-700 p-2"
          placeholder="Nhập tên tài khoản"
          value={formikLogin.values.username}
          onChange={formikLogin.handleChange}
        />
        {formikLogin.errors.username && formikLogin.touched.username && (
          <div className="username-error mb-4 text-red-600">
            {formikLogin.errors.username}
          </div>
        )}

        <label htmlFor="password" className="font-bold">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 w-full rounded-md border border-pink-700 p-2"
          placeholder="Nhập mật khẩu"
          value={formikLogin.values.password}
          onChange={formikLogin.handleChange}
        />
        {formikLogin.errors.password && formikLogin.touched.password && (
          <div className="password-error mb-6 text-red-600">
            {formikLogin.errors.password}
          </div>
        )}
        <button
          type="submit"
          className="mt-1 w-full rounded-md bg-red-500 py-2 text-white"
        >
          Đăng nhập
        </button>
      </form>
      <p className="mt-6 text-sm">Nếu bạn chưa có tài khoản thì ấn</p>
      <button
        type="button"
        className="mt-3 w-full rounded-md bg-red-400 py-2 text-white"
        onClick={enableRegisterBlock}
      >
        Đăng ký
      </button>

      <p className="mt-6 text-sm">Nếu quên mật khẩu</p>
      <button
        type="button"
        className="mt-3 w-full rounded-md bg-red-400 py-2 text-white"
        onClick={enableForgotPasswordBlock}
      >
        Quên mật khẩu
      </button>
    </div>
  );
};

export default Login;

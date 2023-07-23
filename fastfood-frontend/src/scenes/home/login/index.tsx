import axiosInstance from '@/axios/axios.ts';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars.tsx';
import { useAppDispatch } from '@/store';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { authActions } from '@/store/auth/auth-slice.ts';
import { Message } from '@/shared/MessageType.ts';
import { useNavigate } from 'react-router-dom';

type LoginError = {
  username?: string;
  password?: string;
};

type Props = {
  setIsLoginBlockEnable: React.Dispatch<React.SetStateAction<boolean>>;
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
    setIsLoginBlockEnable(false);
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

  const login = (username: string, password: string) => {
    axiosInstance
      .post('/auth/login', { username, password })
      .then((response) => {
        const idAccount: number | '' = response.data as number | '';
        if (typeof idAccount === 'number') {
          setMessageEnable(true);
          setMessage({
            type: 'success',
            message: 'Đăng nhập thành công',
          });

          setTimeout(() => {
            dispatch(authActions.setLogin(idAccount));
          }, 2000);
          // TODO: Lưu vào redux id đăng nhập hiện tại
        } else {
          setMessageEnable(true);
          setMessage({
            type: 'error',
            message: 'Tài khoản hoặc mật khẩu không chính xác',
          });
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
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
    </div>
  );
};

export default Login;

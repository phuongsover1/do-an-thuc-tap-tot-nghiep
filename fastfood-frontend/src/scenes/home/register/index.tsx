import React, { useState } from 'react';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars.tsx';
import { Message } from '@/shared/MessageType.ts';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/axios/axios.ts';
import { useAppDispatch, useAppSelector } from '@/store';
import { RegisterType } from './register-types';
import { authActions } from '@/store/auth/auth-slice.ts';
import { BlockEnable } from '../LoginModal';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(2, 'Tên tài khoản quá ngắn!')
    .max(50, 'Tên tài khoản quá dài!'),
  password: Yup.string()
    .trim()
    .min(5, 'Too short !')
    .matches(/[0-9]+/, { message: 'Have at least 1 number' })
    .matches(/[A-Z]+/, { message: 'Have at least 1 uppercase character !' }),
  email: Yup.string().trim().email('Invalid email!'),
  phoneNumber: Yup.string()
    .trim()
    .min(10, 'Invalid phone number!')
    .max(11, 'Invalid phone number!')
    .matches(/^0/, { message: 'Invalid phone number!' }),
});

type Props = {
  setIsLoginBlockEnable: React.Dispatch<React.SetStateAction<BlockEnable>>;
};
const Register = ({ setIsLoginBlockEnable }: Props) => {
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });

  const idAccount = useAppSelector((state) => state.auth.idAccount);
  const dispatch = useAppDispatch();

  console.log('idAccount: ', idAccount);

  const formikRegister = useFormik({
    initialErrors: {},
    initialValues: {
      username: '',
      password: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      console.log('onSubmit: ', values);
      register(values);
    },
    validate: (values) => {
      const errors = {} as {
        username?: string;
        password?: string;
        email?: string;
        phoneNumber?: string;
      };
      if (!values.username) {
        errors.username = 'Tên tài khoản không được để trống';
      }
      if (!values.password) {
        errors.password = 'Mật khẩu không được để trống';
      }
      if (!values.email) {
        errors.email = 'Email không được để trống';
      }
      if (!values.phoneNumber) {
        errors.phoneNumber = 'Số điện thoại không được để trống';
      }
      return errors;
    },
  });

  function register(values: RegisterType) {
    axiosInstance
      .post('/auth/register', values)
      .then((res) => {
        const data = res.data as {
          idAccount: number | null;
          email?: string;
          phoneNumber?: string;
          username?: string;
        };
        console.log('data: ', data);
        if (data.idAccount !== null) {
          setMessageEnable(true);
          setMessage({
            type: 'success',
            message: 'Đã đăng kí tài khoản thành công',
          });
          dispatch(authActions.setLogin(data.idAccount));
        } else {
          let messages = '';
          if (data.username) messages += data.username + '.\n';
          if (data.email) messages += data.email + '.\n';
          if (data.phoneNumber) messages += data.phoneNumber + '.';
          setMessageEnable(true);
          setMessage({ type: 'error', message: messages });
        }
      })
      .catch((err) => console.log('error: ', err));
  }

  const enableLoginBlock = () => {
    setIsLoginBlockEnable({ login: true });
  };
  return (
    <div>
      <div>
        <CustomizedSnackbars
          open={messageEnable}
          setOpen={setMessageEnable}
          type={messageState.type}
          message={messageState.message}
        />
        <p className="text-lg font-bold">Đăng nhập hoặc tạo tài khoản</p>

        <form
          className="my-3"
          onSubmit={formikRegister.handleSubmit}
          noValidate
          autoComplete={'off'}
        >
          <label htmlFor="username" className="font-bold">
            Tên tài khoản
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="mt-1 w-full rounded-md border border-pink-700 p-2"
            placeholder="Nhập tên tài khoản"
            value={formikRegister.values.username}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            autoComplete={'off'}
          />
          {formikRegister.errors.username &&
            formikRegister.touched.username && (
              <div className="username-error mb-4 text-red-600">
                {formikRegister.errors.username}
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
            value={formikRegister.values.password}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
          />
          {formikRegister.errors.password &&
            formikRegister.touched.password && (
              <div className="password-error mb-4 text-red-600">
                {formikRegister.errors.password}
              </div>
            )}

          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 w-full rounded-md border border-pink-700 p-2"
            placeholder="Nhập email"
            value={formikRegister.values.email}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
          />
          {formikRegister.errors.email && formikRegister.touched.email && (
            <div className="password-error mb-4 text-red-600">
              {formikRegister.errors.email}
            </div>
          )}

          <label htmlFor="phoneNumber" className="font-bold">
            Số điện thoại
          </label>
          <input
            type="phoneNumber"
            id="phoneNumber"
            name="phoneNumber"
            className="mt-1 w-full rounded-md border border-pink-700 p-2"
            placeholder="Nhập số điện thoại"
            value={formikRegister.values.phoneNumber}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
          />
          {formikRegister.errors.phoneNumber &&
            formikRegister.touched.phoneNumber && (
              <div className="password-error mb-6 text-red-600">
                {formikRegister.errors.phoneNumber}
              </div>
            )}

          <button
            type="submit"
            className="mt-1 w-full rounded-md bg-red-500 py-2 text-white"
          >
            Đăng ký
          </button>
        </form>
        <p className="mt-6 text-sm">Nếu bạn đã có tài khoản thì ấn</p>
        <button
          type="button"
          className="mt-3 w-full rounded-md bg-red-400 py-2 text-white"
          onClick={enableLoginBlock}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Register;

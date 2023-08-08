import axiosInstance from '@/axios/axios.ts';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars.tsx';
import { useAppDispatch } from '@/store';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { CartType, authActions } from '@/store/auth/auth-slice.ts';
import { Message } from '@/shared/MessageType.ts';
import { useNavigate } from 'react-router-dom';
import {
  changePasswordNoOldPassword,
  checkEmail,
  checkEmailAndOTP,
  loginRequest,
} from '@/axios';
import { BlockEnable } from '../LoginModal';
import * as Yup from 'yup';
import { changePassword } from '@/axios/staffs';
import NewPassword from './new-password';

type LoginError = {
  username?: string;
  password?: string;
};

type Props = {
  setIsLoginBlockEnable: React.Dispatch<React.SetStateAction<BlockEnable>>;
};

type ForgotPasswordType = {
  email: string;
  otp: string;
};

let forgotAccountId: number;

const ForgotPassword = ({ setIsLoginBlockEnable }: Props) => {
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });
  const [enableOTP, setEnableOTP] = useState(false);
  const [isTrueOTP, setIsTrueOTP] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const enableLoginBlock = () => {
    setIsLoginBlockEnable({ login: true });
  };

  const formikForgotPassword = useFormik({
    initialValues: {
      email: '',
      otp: '',
    },
    onSubmit: async (values) => {
      console.log('onSubmit: ', values);
      if (!enableOTP) {
        const accountId = await checkEmail(values.email, true);
        console.log('accountId: ', accountId);

        setMessageEnable(true);
        if (accountId) {
          forgotAccountId = accountId;
          setEnableOTP(true);
          setMessage({
            type: 'info',
            message: 'Xin hãy điền OTP nhận từ email của bạn',
          });
        } else {
          setMessage({ type: 'error', message: 'Email không tồn tại' });
        }
      } else {
        // Tồn tại email rồi
        const isSuccessfull = await checkEmailAndOTP(values.email, values.otp);
        setMessageEnable(true);
        if (isSuccessfull) {
          setMessage({
            type: 'success',
            message: 'Xác nhận đổi mật khẩu thành công',
          });
          setIsTrueOTP(true);
        } else {
          setMessage({ type: 'error', message: 'Mã OTP không chính xác' });
        }
      }
    },
    validate: (values) => {
      const errors = {} as ForgotPasswordType;
      if (!values.email) {
        errors.email = 'Email không được để trống';
      }

      return errors;
    },
  });

  return (
    <div>
      {!isTrueOTP ? (
        <>
          <CustomizedSnackbars
            open={messageEnable}
            setOpen={setMessageEnable}
            type={messageState.type}
            message={messageState.message}
            duration={3500}
          />
          <p className="text-lg font-bold">Quên mật khẩu</p>

          <form className="my-3" onSubmit={formikForgotPassword.handleSubmit}>
            <label htmlFor="username" className="font-bold">
              Email của tài khoản:
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full rounded-md border border-pink-700 p-2"
              placeholder="Nhập email"
              {...formikForgotPassword.getFieldProps('email')}
            />
            {formikForgotPassword.errors.email &&
              formikForgotPassword.touched.email && (
                <div className="username-error mb-4 text-red-600">
                  {formikForgotPassword.errors.email}
                </div>
              )}

            {enableOTP && (
              <>
                <label htmlFor="password" className="font-bold">
                  OTP
                </label>
                <input
                  type="text"
                  id="opt"
                  className="mt-1 w-full rounded-md border border-pink-700 p-2"
                  placeholder="Nhập OTP"
                  {...formikForgotPassword.getFieldProps('otp')}
                />
              </>
            )}

            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-red-500 py-2 text-white"
            >
              Xác nhận
            </button>
          </form>

          <p className="mt-6 text-sm">Quay về đăng nhập</p>
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-red-400 py-2 text-white"
            onClick={enableLoginBlock}
          >
            Đăng nhập
          </button>
        </>
      ) : (
        <NewPassword
          forgotAccountId={forgotAccountId}
          enableLoginBlock={enableLoginBlock}
        />
      )}
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars.tsx';
import { Message } from '@/shared/MessageType.ts';
import {useFormik} from "formik";

type Props = {
  setIsLoginBlockEnable: React.Dispatch<React.SetStateAction<boolean>>;
};
const Register = ({ setIsLoginBlockEnable }: Props) => {
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });

  const formikRegister = useFormik({
    isInitialValid: true,
    initialValues: {
      username:
    }
  })


  const enableLoginBlock = () => {
    setIsLoginBlockEnable(true);
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

        <form className="my-3" onSubmit={formikLogin.handleSubmit} noValidate>
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
          <div className="username-error mb-4 text-red-600">
            {formikLogin.errors.username && formikLogin.errors.username}
          </div>
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
          <div className="password-error mb-6 text-red-600">
            {formikLogin.errors.password && formikLogin.errors.password}
          </div>
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

import { changePasswordNoOldPassword } from '@/axios';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { Message } from '@/shared/MessageType';
import { useFormik } from 'formik';
import React, { useState } from 'react';

type Props = {
  forgotAccountId: number;
  enableLoginBlock: () => void;
};

const NewPassword = ({ forgotAccountId, enableLoginBlock }: Props) => {
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });
  // TODO: Làm formik cho đổi mật khẩu
  const formikNewPassword = useFormik({
    initialValues: {
      newPassword: '',
      reTypePassword: '',
    },
    onSubmit: async (values) => {
      const responseData = await changePasswordNoOldPassword(
        forgotAccountId,
        values.newPassword,
      );
      setMessageEnable(true);
      if (responseData.error) {
        setMessage({ type: 'error', message: responseData.error });
      } else {
        setMessage({
          type: 'success',
          message: 'Thay đổi mật khẩu thành công',
        });

        setTimeout(() => {
          enableLoginBlock();
        }, 1000);
      }
    },
    validate: (values) => {
      const errors = {} as { password?: string; newTypePassword?: string };

      if (!values.newPassword) {
        errors.password = 'Mật khẩu không được để trống';
      }
      if (!values.reTypePassword) {
        errors.newTypePassword = 'Mật khẩu nhập lại không được để trống';
      }
      if (values.newPassword && values.reTypePassword) {
        if (values.newPassword !== values.reTypePassword) {
          errors.newTypePassword = 'Mật khẩu nhập lại không chính xác';
        }
      }
      return errors;
    },
  });
  return (
    <div>
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
        duration={3500}
      />

      <form className="my-3" onSubmit={formikNewPassword.handleSubmit}>
        <label htmlFor="username" className="font-bold">
          Mật khẩu mới:
        </label>
        <input
          type="password"
          id="new-password"
          className="mt-1 w-full rounded-md border border-pink-700 p-2"
          placeholder="Nhập mật khẩu mới"
          {...formikNewPassword.getFieldProps('newPassword')}
        />
        {formikNewPassword.errors.newPassword &&
          formikNewPassword.touched.newPassword && (
            <div className="username-error mb-4 text-red-600">
              {formikNewPassword.errors.newPassword}
            </div>
          )}

        <label htmlFor="re-type-password" className="font-bold">
          Nhập lại mật khẩu mới:
        </label>
        <input
          type="password"
          id="re-type-password"
          className="mt-1 w-full rounded-md border border-pink-700 p-2"
          placeholder="Nhập lại mật khẩu mới"
          {...formikNewPassword.getFieldProps('reTypePassword')}
        />
        {formikNewPassword.errors.reTypePassword &&
          formikNewPassword.touched.reTypePassword && (
            <div className="username-error mb-4 text-red-600">
              {formikNewPassword.errors.reTypePassword}
            </div>
          )}

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-red-500 py-2 text-white"
        >
          Thay đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default NewPassword;

import { changePassword } from '@/axios/users';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { Message } from '@/shared/MessageType';
import { useAppSelector } from '@/store';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  oldPassword: Yup.string().trim().required('Mật khẩu cũ không được để trống'),
  newPassword: Yup.string().trim().required('Mật khẩu mới không được để trống'),
  newTypedPassword: Yup.string()
    .trim()
    .required('Mật khẩu nhập lại không được để trống'),
});

const initialValues = {
  oldPassword: '',
  newPassword: '',
  newTypedPassword: '',
};
const PasswordManagement = () => {
  const [isOldPasswordCorrect, setisOldPasswordCorrect] = useState(true);
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });
  const accountId = useAppSelector((state) => state.auth.idAccount);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      if (accountId) {
        const returnedObj = await changePassword({
          accountId: accountId,
          password: values.oldPassword,
          newPassword: values.newPassword,
        });
        if (returnedObj.error) {
          setisOldPasswordCorrect(false);
        } else {
          setMessage({
            type: 'success',
            message: 'Thay đổi mật khẩu thành công',
          });
          setMessageEnable(true);
        }
      }
    },
    validationSchema: validationSchema,
    validate: (values) => {
      const errors = {} as {
        oldPassword: string;
        newPassword: string;
        newTypedPassword: string;
      };

      if (values.newPassword && values.newTypedPassword) {
        if (values.newPassword !== values.newTypedPassword) {
          errors.newTypedPassword =
            'Mật khẩu nhập lại không trùng với mật khẩu mới';
        }
      }
      return errors;
    },
  });
  return (
    <div className="pt-5">
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <p className="text-lg font-bold text-slate-700">THAY ĐỔI MẬT KHẨU</p>
      <form
        onSubmit={formik.handleSubmit}
        className="mt-6 grid auto-cols-auto grid-cols-[200px_minmax(0,400px)] gap-y-5"
      >
        <div className="font-semibold text-slate-700">Mật khẩu cũ</div>
        <div>
          <input
            type="password"
            id=""
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập mật khẩu cũ"
            onFocus={() => setisOldPasswordCorrect(true)}
            {...formik.getFieldProps('oldPassword')}
          />
          {formik.errors.oldPassword && formik.touched.oldPassword && (
            <div className="text-red-400">{formik.errors.oldPassword}</div>
          )}

          {!isOldPasswordCorrect && (
            <div className="text-red-400">Mật khẩu cũ không đúng</div>
          )}
        </div>
        <div className="font-semibold text-slate-700">Mật khẩu mới</div>
        <div>
          <input
            type="password"
            id=""
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập mật khẩu mới"
            {...formik.getFieldProps('newPassword')}
          />
          {formik.errors.newPassword && formik.touched.newPassword && (
            <div className="text-red-400">{formik.errors.newPassword}</div>
          )}
        </div>
        <div className="font-semibold text-slate-700">Nhập lại mật khẩu</div>
        <div>
          <input
            type="password"
            id=""
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập mật khẩu mới"
            {...formik.getFieldProps('newTypedPassword')}
          />
          {formik.errors.newTypedPassword &&
            formik.touched.newTypedPassword && (
              <div className="text-red-400">
                {formik.errors.newTypedPassword}
              </div>
            )}
        </div>
        <button
          className="mt-7 rounded-sm bg-red-400 px-10 py-2 font-semibold text-white"
          type="submit"
        >
          Lưu thông tin
        </button>
      </form>
    </div>
  );
};

export default PasswordManagement;

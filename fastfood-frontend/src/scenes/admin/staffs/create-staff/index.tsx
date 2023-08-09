import { checkUsernameEmailPhoneNumber } from '@/axios';
import { createStaff } from '@/axios/admin';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { Message } from '@/shared/MessageType';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  lastName: Yup.string().trim().required('Họ và tên đệm không được để trống'),
  firstName: Yup.string().trim().required('Tên không được để trống'),
  address: Yup.string().trim().required('Địa chỉ không được để trống'),
  email: Yup.string()
    .trim()
    .email('Định dạng email không đúng')
    .required('Email không được để trống'),
  phoneNumber: Yup.string()
    .matches(/^0[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ' })
    .required('Số điện thoại không được để trống'),
  username: Yup.string().trim().required('Tên tài khoản không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống'),
});

const initialValues = {
  lastName: '',
  firstName: '',
  address: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  sex: false,
  username: '',
  password: '',
};

type Props = {
  isAdmin: boolean;
};
const CreateStaff = ({ isAdmin }: Props) => {
  const dayjsObj = dayjs();
  const dateToday = dayjsObj.format('YYYY-MM-DD');
  const [hasErrors, setHasErrors] = useState<{
    username: string;
    email: string;
    phoneNumber: string;
  }>({ username: '', email: '', phoneNumber: '' });

  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });
  const navigate = useNavigate();
  console.log('hasErrors: ', hasErrors);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const responseData = await checkUsernameEmailPhoneNumber(
          values.username,
          values.email,
          values.phoneNumber,
        );
        setHasErrors(responseData);

        if (
          responseData.email === '' &&
          responseData.phoneNumber === '' &&
          responseData.username === ''
        ) {
          try {
            const valuesAfterMap = {
              ...values,
              sex: values.sex ? true : false,
            };
            const staffId = await createStaff(
              valuesAfterMap,
              isAdmin ? 'ADMIN' : 'STAFF',
            );
            if (staffId) {
              setMessage({
                type: 'success',
                message: 'Tạo nhân viên thành công',
              });
              setTimeout(() => {
                navigate(`/admin/staffs/details/${staffId}`);
              }, 1500);
            } else
              setMessage({ type: 'error', message: 'Tạo nhân viên thất bại' });
            setMessageEnable(true);
          } catch (err) {
            console.log('error: ', err);
          }
        }
      } catch (err) {
        console.log('error: ', err);
      }
    },
  });

  return (
    <div className="mx-auto my-5 max-w-2xl p-2 shadow drop-shadow">
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <p className="mb-2 border-b border-red-500 text-center text-lg font-bold text-slate-700">
        THÔNG TIN CÁ NHÂN
      </p>
      <form onSubmit={formik.handleSubmit} className="">
        <div className="mt-6 grid auto-cols-auto grid-cols-2 gap-x-2 gap-y-5 px-3">
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-slate-700">Họ và tên đệm:</div>
            <div>
              <input
                type="text"
                id=""
                className="w-2/3 rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                placeholder="Nhập họ và tên đệm"
                {...formik.getFieldProps('lastName')}
              />
              {formik.errors.lastName && formik.touched.lastName && (
                <div className="text-red-400">{formik.errors.lastName}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-slate-700">Tên:</div>
            <div>
              <input
                type="text"
                id=""
                className="w-2/3 rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                placeholder="Nhập tên"
                {...formik.getFieldProps('firstName')}
              />
              {formik.errors.firstName && formik.touched.firstName && (
                <div className="text-red-400">{formik.errors.firstName}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-slate-700">Ngày sinh:</div>
            <div>
              <input
                type="date"
                max={dateToday}
                id=""
                className="w-2/3 rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                placeholder="Chọn ngày sinh của bạn"
                {...formik.getFieldProps('dateOfBirth')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-slate-700">Giới tính:</div>
            <select
              id="sex"
              className="mt-1 w-2/3 rounded-md border border-pink-700 bg-white p-2"
              {...formik.getFieldProps('sex')}
            >
              <option value={0}>Nam</option>
              <option value={1}>Nữ</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-slate-700">Số điện thoại:</div>
            <div>
              <input
                type="text"
                className="w-2/3 rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                placeholder="Nhập số điện thoại"
                {...formik.getFieldProps('phoneNumber')}
                onChange={(e) => {
                  setHasErrors((prev) => {
                    return { ...prev, phoneNumber: '' };
                  });
                  formik.handleChange(e);
                }}
              />
              {hasErrors?.phoneNumber && (
                <div className="text-red-400">{hasErrors?.phoneNumber}</div>
              )}
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <div className="text-red-400">{formik.errors.phoneNumber}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-slate-700">Email:</div>
            <div>
              <input
                type="email"
                id=""
                className="w-2/3 rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                placeholder="Nhập email của bạn"
                {...formik.getFieldProps('email')}
                onChange={(e) => {
                  setHasErrors((prev) => {
                    return { ...prev, email: '' };
                  });
                  formik.handleChange(e);
                }}
              />
              {hasErrors?.email && (
                <div className="text-red-400">{hasErrors?.email}</div>
              )}
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-400">{formik.errors.email}</div>
              )}
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <div className="font-semibold text-slate-700">Address</div>
            <div>
              <textarea
                id=""
                rows={3}
                className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                placeholder="Nhập địa chỉ của bạn"
                style={{ resize: 'none' }}
                {...formik.getFieldProps('address')}
              ></textarea>
              {formik.errors.address && formik.touched.address && (
                <div className="text-red-400">{formik.errors.address}</div>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <p className="mb-2 border-b border-red-500 text-center text-lg font-bold text-slate-700">
              THÔNG TIN TÀI KHOẢN
            </p>
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-slate-700">
                  Tên tài khoản:{' '}
                </div>
                <input
                  type="text"
                  id=""
                  className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                  placeholder="Nhập tên tài khoản"
                  {...formik.getFieldProps('username')}
                  onChange={(e) => {
                    setHasErrors((prev) => {
                      return { ...prev, username: '' };
                    });
                    formik.handleChange(e);
                  }}
                />
                {hasErrors?.username && (
                  <div className="text-red-400">{hasErrors?.username}</div>
                )}
                {formik.errors.username && formik.touched.username && (
                  <div className="text-red-400">{formik.errors.username}</div>
                )}
              </div>
              <div>
                <div className="font-semibold text-slate-700">Mật khẩu:</div>
                <input
                  type="password"
                  id=""
                  className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
                  placeholder="Nhập mật khẩu"
                  {...formik.getFieldProps('password')}
                />

                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-400">{formik.errors.password}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 pr-3 text-right">
          <button
            className="mt-2 rounded-sm bg-red-400 px-10 py-2 font-semibold text-white"
            type="submit"
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaff;

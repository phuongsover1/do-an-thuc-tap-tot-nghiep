import {
  CheckEmailPhoneNumber,
  StaffInfor,
  checkEmailPhoneNumber,
  getStaffByAccountId,
  updateStaffInfoByAccount,
} from '@/axios/staffs';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { Message } from '@/shared/MessageType';
import { UserInfor } from '@/shared/types';
import { useAppSelector } from '@/store';

import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
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
});

const initialValues: StaffInfor = {
  id: '',
  lastName: '',
  firstName: '',
  address: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
};
const StaffInformation = () => {
  const dayjsObj = dayjs();
  const dateToday = dayjsObj.format('YYYY-MM-DD');
  const accountId = useAppSelector((state) => state.auth.idAccount);
  const [emailAndPhoneNumberErrores, setEmailAndPhoneNumberErrors] =
    useState<CheckEmailPhoneNumber>({ email: '', phoneNumber: '' });

  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (accountId) {
        const emailAndPhoneNumberHasErrors = await checkEmailPhoneNumber(
          {
            email: values.email,
            phoneNumber: values.phoneNumber,
          },
          accountId,
        );
        if (
          emailAndPhoneNumberHasErrors.email ||
          emailAndPhoneNumberHasErrors.phoneNumber
        ) {
          setEmailAndPhoneNumberErrors(emailAndPhoneNumberHasErrors);

          return;
        }
        // no errors
        setEmailAndPhoneNumberErrors({ phoneNumber: '', email: '' });
        const isSuccessful = await updateStaffInfoByAccount(values, accountId);
        if (isSuccessful) {
          setMessageEnable(true);
          setMessage({
            type: 'success',
            message: 'Thay đổi thông tin thành công',
          });
        } else {
          setMessageEnable(true);
          setMessage({
            type: 'error',
            message: 'Thay đổi thông tin thất bại',
          });
        }
      }
    },
  });

  console.log('accountID: ', accountId);

  useEffect(() => {
    console.log('dkm');

    async function fetchUser(accountId: number) {
      const staff = await getStaffByAccountId(accountId);
      if (staff) {
        void formik.setFieldValue('lastName', staff.lastName);
        void formik.setFieldValue('firstName', staff.firstName);
        void formik.setFieldValue('dateOfBirth', staff.dateOfBirth);
        void formik.setFieldValue('email', staff.email);
        void formik.setFieldValue('phoneNumber', staff.phoneNumber);
        void formik.setFieldValue('address', staff.address);
      }
    }
    if (accountId) {
      void fetchUser(accountId);
    }
  }, [accountId]);

  return (
    <div className="pt-5">
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <p className="text-lg font-bold text-slate-700">THÔNG TIN CÁ NHÂN</p>
      <form
        onSubmit={formik.handleSubmit}
        className="mt-6 grid auto-cols-auto grid-cols-[200px_minmax(0,400px)] gap-y-5"
      >
        <div className="font-semibold text-slate-700">Họ và tên đệm</div>
        <div>
          <input
            type="text"
            id=""
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập họ và tên đệm"
            {...formik.getFieldProps('lastName')}
          />
          {formik.errors.lastName && formik.touched.lastName && (
            <div className="text-red-400">{formik.errors.lastName}</div>
          )}
        </div>
        <div className="font-semibold text-slate-700">Tên</div>
        <div>
          <input
            type="text"
            id=""
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập tên"
            {...formik.getFieldProps('firstName')}
          />
          {formik.errors.firstName && formik.touched.firstName && (
            <div className="text-red-400">{formik.errors.firstName}</div>
          )}
        </div>
        <div className="font-semibold text-slate-700">Ngày sinh</div>
        <div>
          <input
            type="date"
            max={dateToday}
            id=""
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Chọn ngày sinh của bạn"
            {...formik.getFieldProps('dateOfBirth')}
          />
        </div>
        <div className="font-semibold text-slate-700">Số điện thoại</div>
        <div>
          <input
            type="text"
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập số điện thoại"
            {...formik.getFieldProps('phoneNumber')}
          />
          {emailAndPhoneNumberErrores.phoneNumber && (
            <div className="text-red-400">
              {emailAndPhoneNumberErrores.phoneNumber}
            </div>
          )}
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <div className="text-red-400">{formik.errors.phoneNumber}</div>
          )}
        </div>
        <div className="font-semibold text-slate-700">Email</div>
        <div>
          <input
            type="email"
            id=""
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập email của bạn"
            {...formik.getFieldProps('email')}
          />
          {emailAndPhoneNumberErrores.email && (
            <div className="text-red-400">
              {emailAndPhoneNumberErrores.email}
            </div>
          )}
          {formik.errors.email && formik.touched.email && (
            <div className="text-red-400">{formik.errors.email}</div>
          )}
        </div>
        <div className="font-semibold text-slate-700">Address</div>
        <div>
          <textarea
            id=""
            cols={20}
            rows={5}
            className="w-full rounded-lg border border-red-400 px-2 py-1 ring-0 focus:outline-none"
            placeholder="Nhập địa chỉ của bạn"
            style={{ resize: 'none' }}
            {...formik.getFieldProps('address')}
          ></textarea>
          {formik.errors.address && formik.touched.address && (
            <div className="text-red-400">{formik.errors.address}</div>
          )}
        </div>
        <div className="my-5">
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

export default StaffInformation;

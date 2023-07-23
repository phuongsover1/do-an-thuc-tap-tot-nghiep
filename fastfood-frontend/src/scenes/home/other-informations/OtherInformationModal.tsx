import BasicModal from '@/shared/BasicModal.tsx';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useAppSelector } from '@/store';
import { Information } from '@/scenes/home/other-informations/information-types.ts';
import axiosInstance from '@/axios/axios.ts';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars.tsx';
import React, { useState } from 'react';
import { Message } from '@/shared/MessageType.ts';

type Props = {
  open: boolean;
  handleClose: () => void;
};
const OtherInformationModal = ({ open, handleClose }: Props) => {
  const dayjsObj = dayjs();
  const dateToday = dayjsObj.format('YYYY-MM-DD');
  const idAccount = useAppSelector((state) => state.auth.idAccount);

  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: dayjsObj.format('YYYY-MM-DD'),
      sex: '1',
      address: '',
    },
    onSubmit: (values) => {
      console.log('onSubmit: ', values);
      if (idAccount !== null) {
        void handleUpdateInformation({ idAccount, userInfo: values });
      }
    },
    validate: (values) => {
      const errors: {
        firstName?: string;
        lastName?: string;
        address?: string;
      } = {};
      if (!values.lastName) {
        errors.lastName = 'Họ và tên lót không được để trống!';
      }
      if (!values.firstName) {
        errors.firstName = 'Tên không được để trống!';
      }
      if (!values.address) errors.address = 'Địa chỉ không được để trống';
      return errors;
    },
  });

  async function handleUpdateInformation(info: Information) {
    try {
      const response = await axiosInstance.post(
        '/users/updateInformation',
        info,
      );
      const isSuccessful = (await response.data) as boolean;
      setMessageEnable(true);
      if (isSuccessful) {
        setMessage({
          type: 'success',
          message: 'Cập nhật thông tin thành công',
        });
        handleClose();
      }
    } catch (errors) {
      setMessage({
        type: 'error',
        message: 'Cập nhật thông tin thất bại. Hãy thử lại!',
      });
    }
  }
  return (
    <>
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <BasicModal
        open={open}
        closeModalHandler={handleClose}
        width={750}
        p={0}
        border=""
        borderRadius="0"
        haveCloseButton={false}
      >
        <div className="text-slate-600 p-4">
          <p className="font-bold text-2xl mb-3">
            Xin hãy nhập thêm thông tin cho tài khoản
          </p>
          <form method="post" onSubmit={formik.handleSubmit} autoComplete="off">
            <div className="flex gap-5">
              <div>
                <label htmlFor="lastName" className="font-bold">
                  Họ và tên lót:
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="mt-1 w-full rounded-md border border-pink-700 p-2"
                  placeholder="Nhập họ và tên lót"
                  autoComplete={'off'}
                  {...formik.getFieldProps('lastName')}
                />
                {formik.errors.lastName && formik.touched.lastName && (
                  <div className="lastName-error mb-4 text-red-600">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="firstName" className="font-bold">
                  Tên:
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="mt-1 w-full rounded-md border border-pink-700 p-2"
                  placeholder="Nhập tên"
                  autoComplete={'off'}
                  {...formik.getFieldProps('firstName')}
                />
                {formik.errors.firstName && formik.touched.firstName && (
                  <div className="firstName-error mb-4 text-red-600">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-32">
              <div>
                <label htmlFor="dateOfBirth" className="font-bold">
                  Ngày sinh
                </label>{' '}
                <input
                  type="date"
                  id="dateOfBirth"
                  max={dateToday}
                  className="mt-1 w-full rounded-md border border-pink-700 p-2"
                  placeholder="Chọn ngày sinh"
                  autoComplete={'off'}
                  {...formik.getFieldProps('dateOfBirth')}
                />
              </div>
              <div>
                <label htmlFor="Giới tính" className="font-bold">
                  Giới tính:
                </label>
                <select
                  id="sex"
                  className="mt-1 w-full rounded-md border border-pink-700 p-2 bg-white"
                  {...formik.getFieldProps('sex')}
                >
                  <option value={0}>Nam</option>
                  <option value={1}>Nữ</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="font-bold">
                Địa chỉ:
              </label>
              <br />
              <input
                type="text"
                id="address"
                placeholder="Hãy nhập địa chỉ của bạn"
                className="mt-1 w-full rounded-md border border-pink-700 p-2"
                {...formik.getFieldProps('address')}
              />
              {formik.errors.address && formik.touched.address && (
                <div className="address-error mb-4 text-red-600">
                  {formik.errors.address}
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </BasicModal>
    </>
  );
};

export default OtherInformationModal;

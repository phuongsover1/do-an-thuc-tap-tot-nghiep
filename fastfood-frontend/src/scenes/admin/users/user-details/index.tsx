import { changeAccountStatus } from '@/axios';
import { UserInfo } from '@/axios/admin';
import axiosInstance from '@/axios/axios';
import {
  StaffInfor,
  changeStaffStatus,
  fetchAccountByStaffId,
  fetchStaffById,
} from '@/axios/staffs';
import { fetchAccountByUserId, fetchUserById } from '@/axios/users';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { Message } from '@/shared/MessageType';
import { AccountInfo } from '@/shared/types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserDetails = () => {
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });
  const { id } = useParams();
  console.log('id: ', id);

  const [user, setUser] = useState<UserInfo | null>(null);
  const [account, setAccount] = useState<null | AccountInfo>(null);

  useEffect(() => {
    const fetch = async (userId: string) => {
      console.log('response 1:');
      const responseData = await fetchUserById(userId);

      setUser(responseData);
    };
    const fetchAccount = async (userId: string) => {
      const responseData = await fetchAccountByUserId(userId);
      console.log('response 2: ', responseData);
      setAccount(responseData);
    };
    if (id) {
      void fetchAccount(id);
      void fetch(id);
    }
  }, [id]);

  let isBlock;
  if (account) {
    if (account.status) isBlock = false;
    else isBlock = true;
  }

  const navigate = useNavigate();

  async function changeAccountStatusHandler() {
    if (account) {
      const responseData = await changeAccountStatus(account.accountId);
      if (responseData) {
        setMessage({
          type: 'success',
          message: 'Thay đổi trạng thái thành công',
        });
        try {
          if (user) {
            const accountData = await fetchAccountByUserId(user.userId);
            setAccount(accountData);
          }
        } catch (error) {
          console.log('error: ', error);
        }
      } else {
        setMessage({ type: 'error', message: 'Thay đổi trạng thái thất bại' });
      }
      setMessageEnable(true);
    }
  }

  return (
    <div className="mx-auto mt-5 max-w-lg p-3 shadow">
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <div>
        <p className="border-b border-red-300 py-2 text-center text-xl font-semibold text-slate-800">
          THÔNG TIN NGƯỜI DÙNG
        </p>
        <div className="grid grid-cols-[150px_minmax(300px,_1fr)] gap-4 p-4">
          <p className="text-slate-600">Mã: </p>
          <p className="font-semibold">{user && user.userId}</p>
          <p className="text-slate-600">Họ và tên:</p>
          <p className="font-semibold">
            {user && user.lastName + ' ' + user.firstName}
          </p>
          <p className="text-slate-600">Ngày sinh:</p>
          <p className="font-semibold">{user && user.dateOfBirth}</p>
          <p className="text-slate-600">Giới tính:</p>
          <p className="font-semibold">
            {user && user.sex === 'false' ? 'Nam' : 'Nữ'}
          </p>
          <p className="text-slate-600">Email:</p>
          <p className="font-semibold">{user?.email}</p>
          <p className="text-slate-600">Số điện thoại:</p>
          <p className="font-semibold">{user?.phoneNumber}</p>
          <p className="text-slate-600">Địa chỉ:</p>
          <p className="font-semibold">{user?.address}</p>
          <p className="text-slate-600">Trạng thái:</p>
          <p
            className={`font-semibold font-semibold ${
              isBlock ? 'text-red-500' : 'text-emerald-500'
            }`}
          >
            {account?.status === true ? 'Đang hoạt động' : 'Đã bị khóa'}
          </p>
        </div>
      </div>
      <div>
        <p className="border-b border-red-300 py-2 text-center text-xl font-semibold text-slate-800">
          THÔNG TIN TÀI KHOẢN
        </p>

        <div className="my-2 grid grid-cols-2">
          <div className="flex items-center gap-2">
            <p className="text-slate-600">Mã tài khoản:</p>
            <p className="font-semibold">{account?.accountId}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-slate-600">Trạng thái:</p>
            <p
              className={`font-semibold ${
                isBlock ? 'text-red-500' : 'text-emerald-500'
              }`}
            >
              {account && account.status === true
                ? 'Đang hoạt động'
                : 'Bị khóa'}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            onClick={changeAccountStatusHandler}
            className={`rounded-sm p-1 px-2 ${
              isBlock ? 'bg-red-400' : 'bg-emerald-600'
            }  text-white`}
          >
            {isBlock ? 'Mở tài khoản' : 'Khóa tài khoản'}
          </button>
          <button
            className="rounded-sm border border-red-300 bg-white p-1 px-2  text-red-400"
            onClick={() => navigate(`/admin/users/${!isBlock}`)}
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

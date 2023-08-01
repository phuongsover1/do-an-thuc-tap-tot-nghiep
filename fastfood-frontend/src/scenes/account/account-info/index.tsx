import { Formik } from 'formik';
import React from 'react';
import UserInformation from './user-information';
import PasswordManagement from './password-management';

const AccountInfo = () => {
  return (
    <div>
      <p className="border-b border-red-400 py-5 text-center text-2xl font-bold text-slate-700">
        THÔNG TIN TÀI KHOẢN
      </p>
      <div className="pb-20 pl-5 pr-28">
        <UserInformation />
        <PasswordManagement />
      </div>
    </div>
  );
};

export default AccountInfo;

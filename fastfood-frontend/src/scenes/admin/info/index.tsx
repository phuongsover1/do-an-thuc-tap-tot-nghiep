import PasswordManagement from '@/scenes/account/account-info/password-management';
import StaffInformation from './staff-information';

const Information = () => {
  return (
    <div>
      <p className="border-b border-red-400 py-5 text-center text-2xl font-bold text-slate-700">
        THÔNG TIN TÀI KHOẢN
      </p>
      <div className="pb-20 pl-5 pr-28">
        <StaffInformation />
        <PasswordManagement />
      </div>
    </div>
  );
};

export default Information;

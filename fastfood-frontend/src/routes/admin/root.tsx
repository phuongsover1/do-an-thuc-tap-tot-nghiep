import AdminNavbar from '@/scenes/admin/navbar/Navbar.tsx';
import Sidebar from '@/scenes/admin/sidebar/Sidebar.tsx';
import { Outlet } from 'react-router-dom';

const AdminRoot = () => {
  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <div className="w-[255px]">
          <Sidebar />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminRoot;

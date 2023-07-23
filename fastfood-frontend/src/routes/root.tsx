import Navbar from '@/shared/Navbar.tsx';
import { Outlet } from 'react-router-dom';

const Root = () => {
  return (
    <div>
      <Navbar />
      <div id="body">
        <Outlet />
      </div>
    </div>
  );
};
export default Root;

import { useAppDispatch, useAppSelector } from '@/store';
import { authActions } from '@/store/auth/auth-slice';
import {
  DocumentTextIcon,
  PowerIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { UserIcon as UserIconSolid } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
  userIconClickedHandler: () => void;
  open: boolean;
};

const UserIconComponent = ({ userIconClickedHandler, open }: Props) => {
  const idAccount = useAppSelector((state) => state.auth.idAccount);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function signOutHandler() {
    dispatch(authActions.setLogout());
    navigate('/', { replace: true });
  }
  return (
    <>
      <button
        className="rounded-full p-2 shadow shadow-gray-300"
        onClick={userIconClickedHandler}
      >
        <UserIcon className="w-6 text-gray-500" />
      </button>
      {idAccount !== null && open && (
        <div className="absolute -left-24 top-20 w-60 rounded-lg bg-white p-6 drop-shadow-xl before:absolute before:-top-2 before:left-[6.5rem] before:z-0 before:h-5 before:w-5 before:rotate-45 before:bg-white before:text-white before:content-['dffd']">
          <ul className="flex flex-col gap-2 text-slate-600">
            <Link to={'/account/info'} onClick={userIconClickedHandler}>
              <li className="flex items-center gap-2">
                <span>
                  <UserIconSolid className="h-6 w-6" />
                </span>
                <span>Account Information</span>
              </li>
            </Link>

            <Link to="/account/history" onClick={userIconClickedHandler}>
              <li className="flex items-center gap-2">
                <span>
                  <DocumentTextIcon className="h-6 w-6" />
                </span>
                <span>Order History</span>
              </li>
            </Link>

            <li>
              <button
                className="flex items-center gap-2"
                onClick={signOutHandler}
              >
                <span>
                  <PowerIcon className="h-6 w-6" />
                </span>
                <span>Sign out</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default UserIconComponent;

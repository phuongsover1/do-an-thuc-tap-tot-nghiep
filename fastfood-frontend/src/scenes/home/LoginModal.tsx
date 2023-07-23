import BasicModal from '@/shared/BasicModal';
import { useState } from 'react';
import LoginBanner from '@/assets/login-banner.jpg';
import Login from './login';
import Register from '@/scenes/home/register';

type Props = {
  open: boolean;
  handleClose: () => void;
};

// type Message = {
//   enable: boolean;
//   message: string;
//   type: 'success' | 'warning' | 'error' | 'info';
// };

// type MessageActionType = {
//   type: 'show' | 'hide';
//   payload: Omit<Message, 'enable'>;
// };
// const messageReducer = (state: Message, action: MessageActionType) => {
//   switch (action.type) {
//     case 'show':
//       return {
//         enable: true,
//         type: action.payload.type,
//         message: action.payload.message,
//       };
//     case 'hide':
//       return { ...state, enable: false };
//     default:
//       return state;
//   }
// };

const LoginModal = ({ open, handleClose }: Props) => {
  const [isLoginBlockEnable, setIsLoginBlockEnable] = useState(true);

  // const [message, dispatchMessage] = useReducer(messageReducer, {
  //   enable: false,
  //   type: 'info',
  //   message: '',
  // });

  return (
    <BasicModal
      open={open}
      width={750}
      p={0}
      border=""
      closeModalHandler={handleClose}
    >
      <div className="flex h-full text-slate-600">
        <div className="basis-2/4 p-4 overflow-auto">
          {isLoginBlockEnable ? (
            <Login setIsLoginBlockEnable={setIsLoginBlockEnable} key="login" />
          ) : (
            <Register
              key="register"
              setIsLoginBlockEnable={setIsLoginBlockEnable}
            />
          )}
        </div>
        <div className="basis-2/4 rounded-r-[20px]">
          <img
            src={LoginBanner}
            className="w-full rounded-r-[20px] h-full"
            alt="login-banner"
          />
        </div>
      </div>
    </BasicModal>
  );
};

export default LoginModal;

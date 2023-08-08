import BasicModal from '@/shared/BasicModal';
import { useState } from 'react';
import LoginBanner from '@/assets/login-banner.jpg';
import Login from './login';
import Register from '@/scenes/home/register';
import ForgotPassword from './forgot-password';

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

export type BlockEnable = {
  login?: boolean;
  register?: boolean;
  forgotPassword?: boolean;
};
const LoginModal = ({ open, handleClose }: Props) => {
  const [blockEnable, setBlockEnable] = useState<BlockEnable>({ login: true });

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
      borderRadius={'20px'}
      closeModalHandler={handleClose}
      haveCloseButton={true}
    >
      <div className="flex h-full text-slate-600">
        <div className="basis-2/4 overflow-auto p-4">
          {blockEnable.login && (
            <Login setIsLoginBlockEnable={setBlockEnable} key="login" />
          )}

          {blockEnable.register && (
            <Register key="register" setIsLoginBlockEnable={setBlockEnable} />
          )}

          {blockEnable.forgotPassword && (
            <ForgotPassword setIsLoginBlockEnable={setBlockEnable} />
          )}
        </div>
        <div className="basis-2/4 rounded-r-[20px]">
          <img
            src={LoginBanner}
            className="h-full w-full rounded-r-[20px]"
            alt="login-banner"
          />
        </div>
      </div>
    </BasicModal>
  );
};

export default LoginModal;

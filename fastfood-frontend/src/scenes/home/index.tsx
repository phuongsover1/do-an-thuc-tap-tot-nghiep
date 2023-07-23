import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import axiosInstance from '@/axios/axios.ts';
import OtherInformationModal from '@/scenes/home/other-informations/OtherInformationModal.tsx';

type Props = {};

const HomePage = (props: Props) => {
  const idAccount = useAppSelector((state) => state.auth.idAccount);
  const [enableForceUserTypeOtherInfor, setEnableForceUserTypeOtherInfor] =
    useState(false);

  function closeUserTypeOtherInfo() {
    setEnableForceUserTypeOtherInfor(false);
  }

  async function checkRegisterRecently(idAccount: number | null) {
    try {
      const response = await axiosInstance.get(
        '/auth/checkUserRegisterRecently',
        {
          params: {
            idAccount: idAccount,
          },
        },
      );
      const isRegisterRecently = (await response.data) as boolean;
      if (isRegisterRecently) {
        console.log('isRegister recently', isRegisterRecently);
        setEnableForceUserTypeOtherInfor(true);
      } else {
        console.log('isRegister recently', isRegisterRecently);
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }
  useEffect(() => {
    if (idAccount != null) {
      void checkRegisterRecently(idAccount);
    }
  }, [idAccount]);
  return (
    <>
      <OtherInformationModal
        open={enableForceUserTypeOtherInfor}
        handleClose={closeUserTypeOtherInfo}
      />
      <div className="h-screen bg-red-600">Home Page</div>;
    </>
  );
};

export default HomePage;

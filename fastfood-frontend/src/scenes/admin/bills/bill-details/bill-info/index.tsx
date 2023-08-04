import { Bill, fetchBill } from '@/axios/bills';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import BasicModal from '@/shared/BasicModal';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { paymentConfirmation } from '@/axios/staffs';
import { useAppSelector } from '@/store';
import { Message } from '@/shared/MessageType';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { useNavigate } from 'react-router-dom';
type Props = {
  bill: Bill;
};

const BillInfo = ({ bill }: Props) => {
  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });
  const [billState, setBill] = useState(bill);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const statusColor =
    billState.status === 'Đã Thanh Toán'
      ? 'text-green-600'
      : billState.status === 'Đã Hủy'
      ? 'text-red-400'
      : 'text-yellow-400';

  const accountId = useAppSelector((state) => state.auth.idAccount);

  const closeModalConfirm = () => {
    setOpenConfirmModal(false);
  };

  const getBill = async (billId: number) => {
    const data = await fetchBill(billId);
    setBill(data);
  };

  const openModalConfirm = () => {
    setOpenConfirmModal(true);
  };

  const confirmPaymentHandler = async () => {
    if (accountId) {
      const responseData = await paymentConfirmation({
        accountId,
        billId: billState.billId,
      });
      if (responseData) {
        setMessage({ type: 'success', message: 'Duyệt đơn hàng thành công' });
        setOpenConfirmModal(false);
        setTimeout(() => {
          void getBill(billState.billId);
        }, 1000);
      } else setMessage({ type: 'error', message: 'Duyệt đơn hàng thất bại' });
      setMessageEnable(true);
    }
  };
  return (
    <>
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <BasicModal
        open={openConfirmModal}
        closeModalHandler={closeModalConfirm}
        haveCloseButton={false}
        p={2}
        width={350}
        borderRadius="10px"
      >
        <p className="flex items-center gap-3 text-lg font-semibold">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
          <span>Tiến hành duyệt đơn hàng {billState.billId} ?</span>
        </p>
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            onClick={() => void confirmPaymentHandler()}
            className="rounded-lg bg-red-400 px-3 py-1 font-semibold text-white"
          >
            Đồng ý
          </button>
          <button
            className="rounded-lg border border-red-400 bg-white px-3 py-1 text-red-400"
            onClick={closeModalConfirm}
          >
            Hủy bỏ
          </button>
        </div>
      </BasicModal>
      <div className="rounded-lg bg-white p-3 shadow">
        <p className="text-center text-sm font-semibold text-slate-800">
          Thông tin đơn hàng
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-500">
            Mã Đơn:{' '}
            <span className="font-semibold text-black">{billState.billId}</span>
          </p>
          <p className="text-sm text-slate-500">
            Ngày đặt hàng:{' '}
            <p className="font-semibold text-black">
              {dayjs(billState.dateCreated).format('DD/MM/YYYY hh:mm:ss A')}
            </p>
          </p>
          {billState.dateSuccessfullyPaid && (
            <p className="text-sm text-slate-500">
              Ngày xác nhận thanh toán thành công:{' '}
              <p className="font-semibold text-black">
                {dayjs(billState.dateSuccessfullyPaid).format(
                  'DD/MM/YYYY hh:mm:ss A',
                )}
              </p>
            </p>
          )}
          <p className="text-sm text-slate-500">
            Phương thức thanh toán:{' '}
            <span className="font-semibold text-black">
              {billState.paymentMethod}
            </span>
          </p>
          <p className="text-sm text-slate-500">
            Trạng thái đơn hàng:{' '}
            <span
              className={`font-semibold uppercase text-black ${statusColor}`}
            >
              {billState.status}
            </span>
          </p>
          {bill.status === 'Đang Chờ Duyệt' && (
            <div className="mt-3 text-right">
              <button
                onClick={openModalConfirm}
                className="rounded-lg bg-red-400 p-2 font-semibold text-white"
              >
                Duyệt đơn
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BillInfo;

import { Bill } from '@/axios/bills';
import React from 'react';
import dayjs from 'dayjs';
type Props = {
  bill: Bill;
};

const BillInfo = ({ bill }: Props) => {
  console.log('bill:', bill);

  const statusColor =
    bill.status === 'Đã Thanh Toán'
      ? 'text-green-600'
      : bill.status === 'Đã Hủy'
      ? 'text-red-400'
      : 'text-yellow-400';
  return (
    <div className="rounded-lg bg-white p-3 shadow">
      <p className="text-center text-sm font-semibold text-slate-800">
        Thông tin đơn hàng
      </p>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-500">
          Mã Đơn:{' '}
          <span className="font-semibold text-black">{bill.billId}</span>
        </p>
        <p className="text-sm text-slate-500">
          Ngày đặt hàng:{' '}
          <p className="font-semibold text-black">
            {dayjs(bill.dateCreated).format('DD/MM/YYYY hh:mm:ss A')}
          </p>
        </p>
        {bill.dateSuccessfullyPaid && (
          <p className="text-sm text-slate-500">
            Xác nhận thanh toán thành công:{' '}
            <p className="font-semibold text-black">
              {dayjs(bill.dateSuccessfullyPaid).format('DD/MM/YYYY hh:mm:ss A')}
            </p>
          </p>
        )}

        <p className="text-sm text-slate-500">
          Phương thức thanh toán:{' '}
          <span className="font-semibold text-black">{bill.paymentMethod}</span>
        </p>
        <p className="text-sm text-slate-500">
          Trạng thái đơn hàng:{' '}
          <span className={`font-semibold uppercase text-black ${statusColor}`}>
            {bill.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default BillInfo;

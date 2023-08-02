import AntdTable from '@/shared/antd-table';
import { Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { BillHistory, fetAllBills } from '@/axios/bills';
import { handleMoney } from '@/shared/Utils';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { validateYupSchema } from 'formik';

const columns: ColumnsType<BillHistory> = [
  {
    title: 'Mã đơn',
    dataIndex: 'billId',
    key: 'billId',
    render: (text) => <p>{text}</p>,

    sorter: (a, b) => a.billId - b.billId,
    sortDirections: ['descend', 'ascend', 'descend'],
  },
  {
    title: 'Ngày đặt',
    dataIndex: 'dateCreated',
    key: 'dateCreated',
    render: (text: string) => (
      <p>{dayjs(text).format('DD/MM/YYYY hh:mm:ss A')}</p>
    ),
    sorter: (a, b) =>
      dayjs(a.dateCreated).toDate().getTime() -
      dayjs(b.dateCreated).toDate().getTime(),
    sortDirections: ['descend', 'ascend', 'descend'],
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    render: (text: string) => (
      <p>
        {handleMoney(parseInt(text))} <span className="underline">đ</span>{' '}
      </p>
    ),
  },
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (text) => (
      <Tag
        className="text-md flex content-center items-center gap-2 align-middle"
        color={
          text === 'Đã Thanh Toán'
            ? 'success'
            : text === 'Đã Hủy'
            ? 'error'
            : 'warning'
        }
      >
        {text === 'Đã Thanh Toán' ? (
          <CheckCircleOutlined />
        ) : text === 'Đã Hủy' ? (
          <CloseCircleOutlined />
        ) : (
          <ClockCircleOutlined />
        )}
        <p className="align-middle">{text}</p>
      </Tag>
    ),
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => (
      <Link
        to={`details/${record.billId}`}
        state={{ ...record }}
        className="bg-red-400 px-2 py-2 font-semibold text-white"
      >
        Xen chi tiết đơn hàng
      </Link>
    ),
  },
];

const AccountHistory = () => {
  const [data, setData] = useState<BillHistory[]>([]);
  const accountId = useAppSelector((state) => state.auth.idAccount);

  useEffect(() => {
    if (accountId) {
      const fetchBills = async (accountId: number) => {
        const data = await fetAllBills(accountId);
        setData(data);
      };
      void fetchBills(accountId);
    }
  }, [accountId]);

  return (
    <div>
      <p className="border-b border-red-400 py-5 text-center text-2xl font-bold text-slate-700">
        LICH SỬ ĐƠN HÀNG
      </p>
      <Table
        columns={columns}
        pagination={{ position: ['bottomRight'] }}
        dataSource={data}
      />
    </div>
  );
};

export default AccountHistory;

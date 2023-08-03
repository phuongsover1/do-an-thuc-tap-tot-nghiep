import { Button, Input, InputRef, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store';
import {
  BillHistory,
  fetAllBills,
  fetchSuccessfulBills,
  fetchWaitingBills,
} from '@/axios/bills';
import { handleMoney } from '@/shared/Utils';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

type DataIndex = keyof BillHistory;

const SuccessfulBills = () => {
  // của antd
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<BillHistory> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  console.log('dayjs: ', dayjs('30/7/2023 9:02:09 PM', 'D/M/YYYY h:mm:ss A'));

  const columns: ColumnsType<BillHistory> = [
    {
      title: 'Mã đơn',
      dataIndex: 'billId',
      key: 'billId',
      render: (text) => <p>{text}</p>,

      sorter: (a, b) => a.billId - b.billId,
      sortDirections: ['descend', 'ascend', 'descend'],

      ...getColumnSearchProps('billId'),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'dateCreated',
      key: 'dateCreated',

      sorter: (a, b) =>
        dayjs(a.dateCreated, 'D/M/YYYY h:mm:ss A').toDate().getTime() -
        dayjs(b.dateCreated, 'D/M/YYYY h:mm:ss A').toDate().getTime(),
      sortDirections: ['descend', 'ascend', 'descend'],
      ...getColumnSearchProps('dateCreated'),
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
      filters: [
        {
          text: 'ZaloPay',
          value: 'ZaloPay',
        },
        {
          text: 'MoMo',
          value: 'MoMo',
        },
        {
          text: 'ShopeePay',
          value: 'ShopeePay',
        },
        {
          text: 'VietinBank',
          value: 'VietinBank',
        },
      ],
      onFilter(value, record) {
        return record.paymentMethod.indexOf(value) === 0;
      },
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

  // của mình,
  const [data, setData] = useState<BillHistory[]>([]);
  console.log('data: ', data);

  const accountId = useAppSelector((state) => state.auth.idAccount);

  useEffect(() => {
    const fetchBills = async (accountId: number) => {
      const responseData = await fetchSuccessfulBills(accountId);
      setData(
        responseData.map((item) => ({
          ...item,
          dateCreated: dayjs(item.dateCreated).format('D/M/YYYY h:mm:ss A'),
        })),
      );
    };
    if (accountId) void fetchBills(accountId);
  }, [accountId]);

  return (
    <div className="mt-20 w-full">
      <p className="border-b border-red-400 py-5 text-center text-2xl font-bold text-slate-700">
        HÓA ĐƠN ĐÃ THANH TOÁN CỦA TÀI KHOẢN
      </p>
      <Table
        columns={columns}
        pagination={{ position: ['bottomRight'] }}
        dataSource={data}
      />
    </div>
  );
};

export default SuccessfulBills;

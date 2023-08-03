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
import { BillHistory, fetAllBills, fetchWaitingBills } from '@/axios/bills';
import { handleMoney } from '@/shared/Utils';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { fetchStaffs } from '@/axios/staffs';

export type Staff = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: boolean;
  email: string;
  phoneNumber: string;
  address: string;
};

type DataIndex = keyof Staff;

const Staffs = () => {
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Staff> => ({
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

  const columns: ColumnsType<Staff> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <p>{text}</p>,

      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend', 'descend'],

      ...getColumnSearchProps('id'),
    },
    {
      title: 'Họ và tên đệm',
      dataIndex: 'lastName',
      key: 'lastName',

      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortDirections: ['descend', 'ascend', 'descend'],
      ...getColumnSearchProps('lastName'),
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text: string) => <p>{text}</p>,
      ...getColumnSearchProps('firstName'),
    },

    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',

      render: (text) => <p>{text}</p>,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Số điện thoại',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Link
          to={`/admin/staffs/details/${record.id}`}
          className="bg-red-400 px-2 py-2 font-semibold text-white"
        >
          Xem chi tiết
        </Link>
      ),
    },
  ];

  // của mình,
  const [data, setData] = useState<Staff[]>([]);

  const { isWorking } = useParams();
  const isWorkingBool = isWorking == 'true';

  useEffect(() => {
    const fetch = async (isWorking: boolean) => {
      const responseData = await fetchStaffs(isWorking);
      setData(responseData);
    };
    if (isWorking) {
      const boolValue = isWorking == 'true';
      void fetch(boolValue);
    }
  }, [isWorking]);

  return (
    <div className="mt-20 w-full">
      <p className="border-b border-red-400 py-5 text-center text-2xl font-bold text-slate-700">
        NHÂN VIÊN {isWorkingBool ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ NGHỈ VIỆC'}
      </p>
      <Table
        columns={columns}
        pagination={{ position: ['bottomRight'] }}
        dataSource={data}
      />
    </div>
  );
};

export default Staffs;

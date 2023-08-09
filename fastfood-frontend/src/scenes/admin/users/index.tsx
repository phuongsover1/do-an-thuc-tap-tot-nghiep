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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { fetchStaffs } from '@/axios/staffs';
import BasicModal from '@/shared/BasicModal';
import CreateStaff from './create-staff';
import { UserInfo, fetchUsers } from '@/axios/admin';

type DataIndex = keyof UserInfo;

const Users = () => {
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
  ): ColumnType<UserInfo> => ({
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

  const columns: ColumnsType<UserInfo> = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (text) => <p>{text}</p>,

      sorter: (a, b) => a.userId.localeCompare(b.userId),
      sortDirections: ['descend', 'ascend', 'descend'],

      ...getColumnSearchProps('userId'),
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
          to={`/admin/users/details/${record.userId}`}
          className="bg-red-400 px-2 py-2 font-semibold text-white"
        >
          Xem chi tiết
        </Link>
      ),
    },
  ];

  // của mình,
  const [data, setData] = useState<UserInfo[]>([]);

  const { isActive } = useParams();
  const isActiveBool = isActive == 'true';

  useEffect(() => {
    const fetch = async (isActive: boolean) => {
      const responseData = await fetchUsers(isActive);
      setData(responseData);
    };
    if (isActive) {
      const boolValue = isActive == 'true';
      void fetch(boolValue);
    }
  }, [isActive]);
  return (
    <div className="mt-20 w-full">
      <p className="border-b border-red-400 py-5 text-center text-2xl font-bold text-slate-700">
        NGƯỜI DÙNG {isActiveBool ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ BỊ KHÓA'}
      </p>

      <Table
        columns={columns}
        pagination={{ position: ['bottomRight'] }}
        dataSource={data}
      />
    </div>
  );
};

export default Users;

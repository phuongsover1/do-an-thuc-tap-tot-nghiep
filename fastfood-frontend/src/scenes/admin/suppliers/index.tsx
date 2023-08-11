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

import BasicModal from '@/shared/BasicModal';

import { Supplier, getAllSuppliers, saveSupplier } from '@/axios/suppliers';
import { useFormik } from 'formik';
import { string } from 'yup';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { Message } from '@/shared/MessageType';

type DataIndex = keyof Supplier;

const Suppliers = () => {
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
  ): ColumnType<Supplier> => ({
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

  const columns: ColumnsType<Supplier> = [
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
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',

      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend', 'descend'],
      ...getColumnSearchProps('name'),
    },

    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      ...getColumnSearchProps('status'),
      render: (text) => {
        const isActive = text === true;
        return (
          <Tag color={`${isActive ? 'success' : 'error'}`}>
            {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Link to={''} className="bg-red-400 px-2 py-2 font-semibold text-white">
          Cập nhật
        </Link>
      ),
    },
  ];

  // của mình,
  const [data, setData] = useState<Supplier[]>([]);
  const [formState, setFormState] = useState(
    {} as
      | {
          open: true;
          type: 'add' | 'update' | 'delete';
        }
      | { open: false },
  );

  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      console.log('onSubmit: ', values);
      const isSuccessful = await saveSupplier(values.name);
      setMessageEnable(true);
      if (isSuccessful) {
        setMessage({
          type: 'success',
          message: 'Thêm nhà cung cấp thành công',
        });
        hideSupplierFormHandler();
        const responseData = await getAllSuppliers();
        setData(responseData);
      } else
        setMessage({ type: 'error', message: 'Thêm nhà cung cấp thất bại' });
    },
    validate: (values) => {
      const errors = {} as { name: string };
      if (!values.name.trim()) errors.name = 'Tên không được để trống';
      return errors;
    },
  });

  function hideSupplierFormHandler() {
    setFormState({ open: false });
  }

  function showAddSupplierFormHandler() {
    setFormState({ open: true, type: 'add' });
  }

  useEffect(() => {
    const fetch = async () => {
      const responseData = await getAllSuppliers();
      setData(responseData);
    };
    void fetch();
  }, []);
  return (
    <div className="mt-20 w-full">
      {formState.open && (
        <div className="fixed inset-0 left-0 top-0 z-30 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"></div>
      )}

      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <p className="border-b border-red-400 py-5 text-center text-2xl font-bold text-slate-700">
        NHÀ CUNG CẤP
      </p>
      <div className="text-right">
        <button
          onClick={showAddSupplierFormHandler}
          className="my-4 mr-4 rounded-sm bg-red-400 p-2 text-white"
        >
          Thêm nhà cung cấp
        </button>
      </div>
      <Table
        columns={columns}
        pagination={{ position: ['bottomRight'] }}
        dataSource={data}
      />
      {/* Add Product Drawer */}
      <div
        id="drawer-create-product-default"
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-xs overflow-y-auto bg-white p-4  transition-transform dark:bg-gray-800 ${
          formState.open && formState.type === 'add' ? '' : 'translate-x-full'
        }`}
        tabIndex="-1"
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
        >
          New Supplier
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-create-product-default"
          aria-controls="drawer-create-product-default"
          className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={hideSupplierFormHandler}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Type product name"
                {...formik.getFieldProps('name')}
              />
              {formik.errors.name && formik.touched.name && (
                <div className="my-2 text-red-400">{formik.errors.name}</div>
              )}
            </div>

            <div className="bottom-0 left-0 flex w-full justify-center space-x-4 pb-4 md:absolute md:px-4">
              <button
                type="submit"
                className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4"
              >
                Add Supplier
              </button>
              <button
                type="button"
                data-drawer-dismiss="drawer-create-product-default"
                aria-controls="drawer-create-product-default"
                className="focus:ring-primary-300 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                onClick={hideSupplierFormHandler}
              >
                <svg
                  aria-hidden="true"
                  className="-ml-1 h-5 w-5 sm:mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Product Drawer */}
      <div
        id="drawer-delete-product-default"
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-xs overflow-y-auto p-4 transition-transform ${
          formState.open && formState.type === 'delete'
            ? ''
            : 'translate-x-full'
        } bg-white dark:bg-gray-800`}
        tabIndex="-1"
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
        >
          Delete item
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-delete-product-default"
          aria-controls="drawer-delete-product-default"
          className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={hideSupplierFormHandler}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <svg
          className="mb-4 mt-8 h-10 w-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="mb-6 text-lg text-gray-500 dark:text-gray-400">
          Are you sure you want to delete this supplier?
        </h3>
        <button className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
          Yes, I'm sure
        </button>
        <button
          className="focus:ring-primary-300 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          data-modal-toggle="delete-product-modal"
          onClick={hideSupplierFormHandler}
        >
          No, cancel
        </button>
      </div>
    </div>
  );
};

export default Suppliers;

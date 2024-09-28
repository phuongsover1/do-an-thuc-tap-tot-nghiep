import { ChangeEvent, useEffect, useState } from 'react';
import { HideProductForm, ShowProductForm } from './product-types';
import axiosInstance from '@/axios/axios';
import { useFormik } from 'formik';
import CustomizedSnackbars from '@/shared/CustomizedSnackbars';
import { Message } from '@/shared/MessageType';
import { useAppSelector } from '@/store';
import { fetchUpdateProduct } from '@/axios/admin';
import * as Yup from 'yup';
import { deleteProductById } from '@/axios/products';
import {
  Supplier,
  getAllSuppliers,
  getAllSuppliersisActive,
} from '@/axios/suppliers';

type AddFormSubmitValues = {
  name: string;
  description: string;
  price: number;
  image: string | Blob;
};

export type ProductFromApi = {
  id: number;
  name: string;
  status: boolean;
  price: string;
  description: string;
  stock: number;
  images: [];
};
export type UpdateProductFromApi = {
  id: number;
  name: string;
  price: number;
  description: string;
  status: boolean;
  categories: string[];
};

type Category = {
  id: number;
  name: string;
  description: string;
};

type ProductImportType = {
  accountId: number;
  productId: number;
  quantity: number;
  price: number;
  supplier: string;
};
const addProductSchema = Yup.object({
  name: Yup.string().trim().required('Tên sản phẩm không được để trống'),
  categories: Yup.array().min(1, 'Danh mục phải chọn ít nhất 1 cái'),
  price: Yup.number()
    .positive()
    .typeError('Giá không hợp lệ')
    .required('Giá không được để trống'),
  image: Yup.string().trim().required('Hình không được để trống'),
});

const updateProductSchema = Yup.object({
  name: Yup.string().trim().required('Tên sản phẩm không được để trống'),
  categories: Yup.array().min(1, 'Danh mục phải chọn ít nhất 1 cái'),
  price: Yup.number()
    .positive()
    .typeError('Giá không hợp lệ')
    .required('Giá không được để trống'),
});

let deleteProductId: number | null = null;

const Product = () => {
  const [formProductState, setFormProductState] = useState<
    HideProductForm | ShowProductForm
  >({ showForm: false });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<null | Blob>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<ProductFromApi[]>([]);
  const [productUpdate, setProductUpdate] =
    useState<UpdateProductFromApi | null>(null);

  const [messageEnable, setMessageEnable] = useState(false);
  const [messageState, setMessage] = useState<Message>({
    type: 'info',
    message: '',
  });

  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    id: string;
    stock: string;
    price: string;
  }>({ name: '', id: '', stock: '', price: '' });

  const roleName = useAppSelector((state) => state.auth.roleName);

  const accountId = useAppSelector((state) => state.auth.idAccount);

  const formik = useFormik({
    initialValues: {
      name: '',
      categories: [],
      description: '',
      price: '0',
      image: '' as string | Blob,
    },
    validationSchema: addProductSchema,
    onSubmit: (values) => {
      console.log('onSubmit: ', values);

      submitAddProduct(values)
        .then(() => {
          setMessageEnable(true);
          setMessage({ type: 'success', message: 'Thêm sản phẩm thành công' });
          hideProductFormHandler();
          void getAllProducts();
        })
        .catch((err) => console.log(err));

      // get image from spring
      /*       axiosInstance
        .get('/products/image', {
          params: {
            productId: 50302,
            imageName: 'anh 1',
          },
          responseType: 'blob',
        })
        .then((res) => {
          setTestImageSrc(URL.createObjectURL(res.data));
        })
        .catch((err) => console.log(err)); */
    },
  });

  const formikUpdateProduct = useFormik({
    initialValues: {
      name: '',
      price: '0',
      description: '',
      categories: [] as string[],
      image: '' as string | Blob,
    },
    validationSchema: updateProductSchema,
    onSubmit: async (values) => {
      console.log('update values: ', values);

      try {
        const response = await axiosInstance.post('/products/update', {
          ...values,
          id: productUpdate?.id,
        });
        const responseData = response.data as number | null;
        if (responseData) {
          if (values.image !== '') {
            if (selectedImage) {
              updateImage(responseData, selectedImage);
            }
          }
          setMessage({
            type: 'success',
            message: 'Sửa đổi sản phẩm thành công',
          });
          setMessageEnable(true);
          hideProductFormHandler();
          void getAllProducts();
        } else {
          setMessage({ type: 'error', message: 'Sửa đổi sản phẩm thất bại' });
          setMessageEnable(true);
        }
      } catch (err) {
        console.log('error: ', err);
      }
    },
  });

  const formikImportProduct = useFormik({
    initialValues: {
      price: 0,
      quantity: 0,
      supplier: '',
    },
    onSubmit: (values, { resetForm }) => {
      console.log('onSubmit: ', values);
      const requestData: ProductImportType = {
        accountId: accountId!,
        productId: parseInt(selectedProduct.id),
        quantity: values.quantity,
        price: values.price,
        supplier: values.supplier,
      };
      console.log('requestData: ', requestData);

      void addImportProductToDB(requestData);
      resetForm();
    },
    validate: (values) => {
      const errors = {} as { price: string; quantity: string };
      if (values.price <= 0) errors.price = 'Giá không hợp lệ';
      if (values.quantity <= 0)
        errors.quantity = 'Số lượng nhập hàng không hợp lệ';
      return errors;
    },
  });

  async function addImportProductToDB(data: ProductImportType) {
    const response = await axiosInstance.post('/staffs/importNote', data);
    const importNoteId = response.data as number | null;
    if (importNoteId) {
      hideProductFormHandler();
      setMessage({ type: 'success', message: 'Nhập hàng thành công' });
      void getAllProducts();
    } else {
      setMessage({ type: 'error', message: 'Nhập hàng thất bại' });
    }
    setMessageEnable(true);
  }

  async function fetchSuppliers() {
    const responseData = await getAllSuppliersisActive();
    setSuppliers(responseData);
  }

  useEffect(() => {
    void fetchSuppliers();
  }, []);

  useEffect(() => {
    void getAllProducts();
  }, []);

  async function getAllProducts() {
    try {
      const response = await axiosInstance.get('/products/allProducts');
      const productArr = response.data as ProductFromApi[];
      console.log('productArr: ', productArr);

      setProducts(productArr);
    } catch (e) {
      console.log('error: ', e);
    }
  }

  async function getAllCategories() {
    try {
      const response = await axiosInstance.get('/categories');
      console.log('in getAll: ', response);
      setCategories(response.data as Category[]);
    } catch (e) {
      console.log('error: ', e);
    }
  }
  function onChangeImageHandler(e: Event) {
    e.preventDefault();
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setSelectedImage(e.target.files[0]);
  }
  function uploadImage(productId: number, selectedImage: Blob) {
    const formData = new FormData();
    formData.append('file', selectedImage);

    axiosInstance
      .post('/products/uploadImage', formData, {
        params: { productId },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => console.log('res', res))
      .catch((err) => console.log('error: ', err));
  }
  function updateImage(productId: number, selectedImage: Blob) {
    const formData = new FormData();
    formData.append('file', selectedImage);

    axiosInstance
      .post('/products/updateImage', formData, {
        params: { productId },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => console.log('res', res))
      .catch((err) => console.log('error: ', err));
  }

  async function submitAddProduct(values: AddFormSubmitValues) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete values.image;
    try {
      const response = await axiosInstance.post('/products', values);
      const responseData = response.data as null | number;
      if (responseData !== null) {
        console.log('productId: ', responseData);

        if (selectedImage) {
          uploadImage(responseData, selectedImage);
        }
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }
  function showAddFormProductHandler() {
    void getAllCategories();
    setFormProductState({ showForm: true, type: 'add-new' });
  }

  function showImportProductHandler(e: ChangeEvent<HTMLButtonElement>) {
    const button = e.currentTarget;
    console.log('button: ', button);

    setSelectedProduct({
      name: button.dataset.productname!,
      id: button.dataset.productid!,
      stock: button.dataset.productstock!,
      price: button.dataset.productprice!,
    });
    setFormProductState({ showForm: true, type: 'import' });
  }

  async function showUpdateFormProductHandler(
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    console.log('button event: ', e.currentTarget);
    const button = e.currentTarget;
    const id = parseInt(button.id.substring(button.id.lastIndexOf('-') + 1));
    const responseData = await fetchUpdateProduct(id);
    setProductUpdate(responseData);
    console.log('responseData: ', responseData);
    void getAllCategories();

    setFormProductState({ showForm: true, type: 'update' });

    void formikUpdateProduct.setFieldValue('name', responseData.name, false);
    void formikUpdateProduct.setFieldTouched('name', false);
    void formikUpdateProduct.setFieldValue(
      'price',
      Math.floor(responseData.price),
      false,
    );
    void formikUpdateProduct.setFieldTouched('price', false);
    void formikUpdateProduct.setFieldValue(
      'description',
      responseData.description,
    );

    void formikUpdateProduct.setFieldValue(
      'categories',
      responseData.categories,
      false,
    );
    void formikUpdateProduct.setFieldTouched('categories', false);
    axiosInstance
      .get('/products/image', {
        params: {
          productId: responseData.id,
          imageName: 'anh 1',
        },
        responseType: 'blob',
      })
      .then((res) => {
        setPreviewImage(URL.createObjectURL(res.data));
      })
      .catch((err) => console.log(err));
  }

  async function deleteProduct() {
    console.log('deleteProductId: ', deleteProductId);
    if (deleteProductId) {
      const error = await deleteProductById(deleteProductId);
      setMessageEnable(true);
      if (error) {
        setMessage({ type: 'error', message: error });
      } else {
        setMessage({ type: 'success', message: 'Xóa sản phẩm thành công' });
        hideProductFormHandler();
        void getAllProducts();
      }
    }
  }

  function showDeleteProductHandler(e: React.MouseEvent<HTMLButtonElement>) {
    setFormProductState({ showForm: true, type: 'delete' });
    const button = e.currentTarget;
    deleteProductId = parseInt(
      button.id.substring(button.id.lastIndexOf('-') + 1),
    );
  }
  function hideProductFormHandler() {
    setFormProductState({ showForm: false });
  }

  return (
    <div className="ml-[50px] mt-[-20px] min-h-screen w-full pt-20">
      {formProductState.showForm && (
        <div className="fixed inset-0 left-0 top-0 z-30 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"></div>
      )}
      <CustomizedSnackbars
        open={messageEnable}
        setOpen={setMessageEnable}
        type={messageState.type}
        message={messageState.message}
      />
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex lg:mt-1.5">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <nav className="mb-5 flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
                <li className="inline-flex items-center">
                  <a
                    href="#"
                    className="hover:text-primary-600 inline-flex items-center text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    <svg
                      className="mr-2.5 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <a
                      href="#"
                      className="hover:text-primary-600 ml-1 text-gray-700 dark:text-gray-300 dark:hover:text-white md:ml-2"
                    >
                      E-commerce
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span
                      className="ml-1 text-gray-400 dark:text-gray-500 md:ml-2"
                      aria-current="page"
                    >
                      Products
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All products
            </h1>
          </div>
          <div className="block items-center justify-between dark:divide-gray-700 sm:flex md:divide-x md:divide-gray-100">
            <div className="mb-4 flex items-center sm:mb-0">
              <form className="sm:pr-3" action="#" method="GET">
                <label htmlFor="products-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 w-48 sm:w-64 xl:w-96">
                  <input
                    type="text"
                    name="email"
                    id="products-search"
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                    placeholder="Search for products"
                  />
                </div>
              </form>
              <div className="flex w-full items-center sm:justify-end">
                <div className="flex space-x-1 pl-2">
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            {roleName && roleName === 'ADMIN' && (
              <button
                id="createProductButton"
                className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4"
                type="button"
                data-drawer-target="drawer-create-product-default"
                data-drawer-show="drawer-create-product-default"
                aria-controls="drawer-create-product-default"
                data-drawer-placement="right"
                onClick={showAddFormProductHandler}
              >
                Add new product
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="h-full min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all"
                          aria-describedby="checkbox-1"
                          type="checkbox"
                          className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        />
                        <label htmlFor="checkbox-all" className="sr-only">
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-{{ .id }}"
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                          />
                          <label
                            htmlFor="checkbox-{{ .id }}"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {'category'}
                        </div>
                      </td>
                      <td className="max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                        {product.description}
                      </td>
                      <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                        {product.id}
                      </td>
                      <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                        {parseInt(product.price)}
                      </td>
                      <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                        {product.status ? 'Đang được bán' : 'Đã ngừng bán'}
                      </td>
                      <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                        {product.stock}
                      </td>
                      {roleName && roleName === 'ADMIN' && (
                        <td className="space-x-2 whitespace-nowrap p-4">
                          <button
                            type="button"
                            id={`updateProductButton-${product.id}`}
                            data-drawer-target="drawer-update-product-default"
                            data-drawer-show="drawer-update-product-default"
                            aria-controls="drawer-update-product-default"
                            data-drawer-placement="right"
                            className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4"
                            onClick={showUpdateFormProductHandler}
                          >
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                              <path
                                fill-rule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            Update
                          </button>
                          <button
                            type="button"
                            id={`deleteProductButton-${product.id}`}
                            data-drawer-target="drawer-delete-product-default"
                            data-drawer-show="drawer-delete-product-default"
                            aria-controls="drawer-delete-product-default"
                            data-drawer-placement="right"
                            className="inline-flex items-center rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                            onClick={showDeleteProductHandler}
                          >
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            Delete item
                          </button>
                        </td>
                      )}
                      {roleName && roleName === 'STAFF' && (
                        <td className="space-x-2 whitespace-nowrap p-4">
                          <button
                            type="button"
                            id={`importProductButton-${product.id}`}
                            data-productname={`${product.name}`}
                            data-productid={`${product.id}`}
                            data-productstock={`${product.stock}`}
                            data-productprice={`${parseInt(product.price)}`}
                            data-drawer-target="drawer-update-product-default"
                            data-drawer-show="drawer-update-product-default"
                            aria-controls="drawer-update-product-default"
                            data-drawer-placement="right"
                            className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4"
                            onClick={showImportProductHandler}
                          >
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                              <path
                                fill-rule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            Nhập hàng
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}

                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="w-4 p-4"></td>
                    <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400"></td>
                    <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white"></td>
                    <td className="max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs"></td>
                    <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white"></td>
                    <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white"></td>
                    <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white"></td>

                    <td className="space-x-2 whitespace-nowrap p-4"></td>
                  </tr>
                  <div className="h-max bg-black"></div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
        <div className="mb-4 flex items-center sm:mb-0">
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="h-7 w-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
          <a
            href="#"
            className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="h-7 w-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              1-20
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              2290
            </span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="#"
            className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4"
          >
            <svg
              className="-ml-1 mr-1 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Previous
          </a>
          <a
            href="#"
            className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4"
          >
            Next
            <svg
              className="-mr-1 ml-1 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
      </div>

      {/* FIXME:  Edit Product Drawer */}
      <div
        id="drawer-create-product-default"
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-xs overflow-y-auto p-4 transition-transform ${
          formProductState.showForm && formProductState.type === 'update'
            ? ''
            : 'translate-x-full'
        }  bg-white dark:bg-gray-800`}
        tabIndex="-1"
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
        >
          Update Product
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-create-product-default"
          aria-controls="drawer-create-product-default"
          className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => {
            hideProductFormHandler();
            void formikUpdateProduct.setFieldValue('name', '');
            void formikUpdateProduct.setFieldValue('price', '');
            void formikUpdateProduct.setFieldValue('description', '');
            void formikUpdateProduct.setFieldValue('categories', []);
            void formikUpdateProduct.setFieldValue('image', '');
          }}
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
        <form onSubmit={formikUpdateProduct.handleSubmit}>
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
                {...formikUpdateProduct.getFieldProps('name')}
              />
              <div className="my-1 my-1 text-red-400">
                {formikUpdateProduct.errors.name &&
                  formikUpdateProduct.touched.name &&
                  formikUpdateProduct.errors.name}
              </div>
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="$2999"
                {...formikUpdateProduct.getFieldProps('price')}
              />
              <div className="my-1 text-red-400">
                {formikUpdateProduct.errors.price &&
                  formikUpdateProduct.touched.price &&
                  formikUpdateProduct.errors.price}
              </div>
            </div>
            <div>
              <label
                htmlFor="category-create"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <select
                id="category-create"
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                {...formikUpdateProduct.getFieldProps('categories')}
                multiple
              >
                {categories.map((category) => (
                  <option
                    value={category.id}
                    key={`${category.id} ${category.name}`}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="my-1 text-red-400">
                {formikUpdateProduct.errors.categories &&
                  formikUpdateProduct.touched.categories &&
                  formikUpdateProduct.errors.categories}
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter event description here"
                {...formikUpdateProduct.getFieldProps('description')}
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/jpeg"
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                {...formikUpdateProduct.getFieldProps('image')}
                onChange={(e) => {
                  formikUpdateProduct.handleChange(e);
                  onChangeImageHandler(e);
                }}
              />
            </div>
            <div>
              <img src={previewImage} className="h-24 w-24" alt="" />
            </div>

            <div className="flex w-full justify-center space-x-4 pb-4 md:px-4">
              <button
                type="submit"
                className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4"
              >
                Update product
              </button>
              <button
                type="button"
                data-drawer-dismiss="drawer-create-product-default"
                aria-controls="drawer-create-product-default"
                className="focus:ring-primary-300 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                onClick={() => {
                  hideProductFormHandler();
                  void formikUpdateProduct.setFieldValue('name', '');
                  void formikUpdateProduct.setFieldValue('price', '');
                  void formikUpdateProduct.setFieldValue('description', '');
                  void formikUpdateProduct.setFieldValue('categories', []);
                  void formikUpdateProduct.setFieldValue('image', '');
                }}
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
      {/*  Nhập hàng form */}

      <div
        id="drawer-update-product-default"
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-xs overflow-y-auto p-4 transition-transform ${
          formProductState.showForm && formProductState.type === 'import'
            ? ''
            : 'translate-x-full '
        } bg-white dark:bg-gray-800`}
        tabIndex={-1}
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
        >
          Nhập hàng
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-update-product-default"
          aria-controls="drawer-update-product-default"
          className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={hideProductFormHandler}
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
        <form onSubmit={formikImportProduct.handleSubmit}>
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Tên sản phẩm:</span>{' '}
              {selectedProduct.name}
            </p>
            <p>
              <span className="font-semibold">Id sản phẩm:</span>{' '}
              {selectedProduct.id}
            </p>
            <p>
              <span className="font-semibold">Giá hiện tại của sản phẩm: </span>{' '}
              {selectedProduct.price}
            </p>
            <p>
              <span className="font-semibold">
                Số lượng hiện tại trong kho sản phẩm:
              </span>{' '}
              {selectedProduct.stock}
            </p>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Số lượng
              </label>
              <input
                min={0}
                type="number"
                id="quantity"
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Nhập số lượng cần thêm vào kho"
                {...formikImportProduct.getFieldProps('quantity')}
              />
              {formikImportProduct.errors.quantity &&
                formikImportProduct.touched.quantity && (
                  <div className="text-red-400">
                    {formikImportProduct.errors.quantity}
                  </div>
                )}
            </div>
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Giá
              </label>
              <input
                type="number"
                id="price"
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Nhập giá của sản phẩm khi nhập vào kho"
                {...formikImportProduct.getFieldProps('price')}
              />
              {formikImportProduct.errors.price &&
                formikImportProduct.touched.price && (
                  <div className="text-red-400">
                    {formikImportProduct.errors.price}
                  </div>
                )}
            </div>
            <div>
              <label
                htmlFor="category-create"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nhà cung cấp
              </label>
              <select
                id="category-create"
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                {...formikImportProduct.getFieldProps('supplier')}
              >
                {suppliers.map((supplier) => (
                  <option
                    value={supplier.id}
                    key={`${supplier.id} ${supplier.name}`}
                  >
                    {supplier.name}
                  </option>
                ))}
              </select>
              {formikImportProduct.errors.supplier &&
                formikImportProduct.touched.supplier && (
                  <div className="text-red-400">
                    {formikImportProduct.errors.supplier}
                  </div>
                )}
            </div>
          </div>
          <div className="bottom-0 left-0 mt-4 flex w-full justify-center space-x-4 pb-4 sm:absolute sm:mt-0 sm:px-4">
            <button
              type="submit"
              className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Xác nhận
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-lg border border-red-600 px-5 py-2.5 text-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
              onClick={hideProductFormHandler}
            >
              <svg
                aria-hidden="true"
                className="-ml-1 mr-1 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Hủy
            </button>
          </div>
        </form>
      </div>

      {/* Delete Product Drawer */}
      <div
        id="drawer-delete-product-default"
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-xs ${
          formProductState.showForm && formProductState.type === 'delete'
            ? ''
            : 'translate-x-full'
        } overflow-y-auto bg-white p-4 transition-transform dark:bg-gray-800`}
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
          onClick={hideProductFormHandler}
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
          Are you sure you want to delete this product?
        </h3>
        <button
          onClick={deleteProduct}
          className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
        >
          Yes, I'm sure
        </button>
        <button
          onClick={hideProductFormHandler}
          className="focus:ring-primary-300 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          data-modal-toggle="delete-product-modal"
        >
          No, cancel
        </button>
      </div>

      {/* Add Product Drawer */}
      <div
        id="drawer-create-product-default"
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-xs overflow-y-auto p-4 transition-transform ${
          formProductState.showForm && formProductState.type === 'add-new'
            ? ''
            : 'translate-x-full'
        }  bg-white dark:bg-gray-800`}
        tabIndex="-1"
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
        >
          New Product
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-create-product-default"
          aria-controls="drawer-create-product-default"
          className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={hideProductFormHandler}
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
              <div className="my-1 text-red-400">
                {formik.errors.name &&
                  formik.touched.name &&
                  formik.errors.name}
              </div>
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Price
              </label>
              <input
                type="text"
                id="price"
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="$2999"
                {...formik.getFieldProps('price')}
              />
              <div className="my-1 text-red-400">
                {formik.errors.price &&
                  formik.touched.price &&
                  formik.errors.price}
              </div>
            </div>
            <div>
              <label
                htmlFor="category-create"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <select
                id="category-create"
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                {...formik.getFieldProps('categories')}
                multiple
              >
                {categories.map((category) => (
                  <option
                    value={category.id}
                    key={`${category.id} ${category.name}`}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="my-1 text-red-400">
                {formik.errors.categories &&
                  formik.touched.categories &&
                  formik.errors.categories}
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter event description here"
                {...formik.getFieldProps('description')}
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/jpeg"
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                {...formik.getFieldProps('image')}
                onChange={(e) => {
                  formik.handleChange(e);
                  onChangeImageHandler(e);
                }}
              />
              <div className="my-1 text-red-400">
                {formik.errors.image &&
                  formik.touched.image &&
                  formik.errors.image}
              </div>
            </div>
            <div>
              <img src={previewImage} className="h-24 w-24" alt="" />
            </div>

            <div className="flex w-full justify-center space-x-4 pb-4 md:px-4">
              <button
                type="submit"
                className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4"
              >
                Add product
              </button>
              <button
                type="button"
                data-drawer-dismiss="drawer-create-product-default"
                aria-controls="drawer-create-product-default"
                className="focus:ring-primary-300 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                onClick={hideProductFormHandler}
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
    </div>
  );
};

export default Product;

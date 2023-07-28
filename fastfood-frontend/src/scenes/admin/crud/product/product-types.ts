export type HideProductForm = {
  showForm: false;
};

type AddNewProduct = 'add-new';
type UpdateProduct = 'update';
type DeleteProduct = 'delete';
type ImportProduct = 'import';
export type ShowProductForm = {
  showForm: true;
  type: AddNewProduct | UpdateProduct | DeleteProduct | ImportProduct;
};

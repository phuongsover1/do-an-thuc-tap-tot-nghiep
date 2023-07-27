import React from 'react';
import ProductCard from './ProductCard';

type Props = {};

const ProductList = (props: Props) => {
  return (
    <div className="py-8 px-16">
      <div className="grid grid-cols-4 gap-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
};

export default ProductList;

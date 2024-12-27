import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { fetchProducts } from '../../utils/api/products';
import { cartItemsAtom, productsAtom } from '../../utils/store';
import ProductCard from './ProductCard';

const MyProducts: React.FC = () => {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [products, setProducts] = useAtom(productsAtom);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    loadProducts();
  }, [setProducts]);

  const toggleProduct = (index: number) => {
    setCartItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  if (products.length == 0) return <div className='w-full p-6 justify-center items-center flex text-white text-2xl'>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          isInCart={cartItems.includes(index)}
          toggleProduct={toggleProduct}
        />
      ))}
    </div>
  );
};

export default MyProducts;

import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { fetchProducts } from '../../utils/api/products';
import { cartItemsAtom, productsAtom } from '../../utils/store';

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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="flex items-center rounded-lg shadow-lg bg-white p-4 transition-transform transform hover:scale-105"
                >
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600 text-lg">Price: ${product.price}</p>
                    </div>
                    <button
                        className={`mr-4 px-4 py-2 rounded text-white flex items-center ${
                            cartItems.includes(index) ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        onClick={() => toggleProduct(index)}
                    >
                        {cartItems.includes(index) ? (
                            <>
                                <MdDelete className="mr-2" />
                                Remove
                            </>
                        ) : (
                            <>
                                <IoIosAddCircle className="mr-2" />
                                Add
                            </>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MyProducts;

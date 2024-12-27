import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  index: number;
  isInCart: boolean;
  toggleProduct: (index: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, isInCart, toggleProduct }) => {
  return (
    <div className="flex items-center rounded-lg shadow-lg bg-white p-4 transition-transform transform hover:scale-105">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
        <p className="text-gray-600 text-lg">Price: ${product.price}</p>
      </div>
      <button
        className={`mr-4 px-4 py-2 rounded text-white flex items-center ${
          isInCart ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => toggleProduct(index)}
      >
        {isInCart ? (
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
  );
};

export default ProductCard;

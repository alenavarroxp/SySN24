import { useAtom } from 'jotai';
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { itemCountAtom, totalPriceAtom } from '../../utils/store';

interface MyCartProps {
    onCheckout: () => void;
}

const MyCart: React.FC<MyCartProps> = ({ onCheckout }) => {
    const [itemCount] = useAtom(itemCountAtom);
    const [totalPrice] = useAtom(totalPriceAtom);

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-4">
                <FaShoppingCart className="text-2xl" />
                <span className="text-lg">Items: {itemCount}</span>
                <span className="text-lg">Total: ${totalPrice.toFixed(2)}</span>
            </div>
            <button
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
                onClick={onCheckout}
            >
                Checkout
            </button>
        </footer>
    );
};

export default MyCart;

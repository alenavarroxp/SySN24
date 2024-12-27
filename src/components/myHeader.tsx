import React from 'react';
import { FaDatabase } from 'react-icons/fa';
import { insertProduct } from '../utils/api/products';

interface MyHeaderProps {
    title: string;
}

const MyHeader: React.FC<MyHeaderProps> = ({ title }) => {
    // Puedes agregar aquí cualquier lógica o constantes que necesites
    const handleButtonClick = async () => {
        await insertProduct();
        setTimeout(async() => {
            window.location.reload();
        }, 1000);
    };

    const authorNames = [
        "Alejandro Navarro de la Cruz",
        "Alonso Illán Martínez del Santo",
        "Javier Domingo Collado",
        "Juan Miguel García González"
    ];

    return (
        <header className="p-8 flex justify-between items-center text-white border-b-2 shadow-2xl">
            <div className='w-48'>
                {authorNames.slice(0, 2).map((name, index) => (
                    <p key={index} className='text-xs mb-1'>{name}</p>
                ))}
            </div>
            <div className="text-5xl font-bold drop-shadow-lg text-gray-100 flex items-center justify-center">
                {title}
                <button 
                    className="ml-4 p-2 bg-green-500 text-white rounded-full hover:bg-green-600" 
                    onClick={handleButtonClick}
                >
                    <FaDatabase className="h-6 w-6" />
                </button>
            </div>
            <div className='w-48 text-end'>
                {authorNames.slice(2).map((name, index) => (
                    <p key={index} className='text-xs mb-1'>{name}</p>
                ))}
            </div>
        </header>
    );
};

export default MyHeader;

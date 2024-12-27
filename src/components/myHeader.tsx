import React from 'react';

interface MyHeaderProps {
    title: string;
}

const MyHeader: React.FC<MyHeaderProps> = ({ title }) => (
    <header className="p-8 flex justify-between items-center text-white border-b-2 shadow-2xl">
        <div className='w-48'>
            <p className='text-xs mb-1'>Alejandro Navarro de la Cruz</p>
            <p className='text-xs mb-1'>Alonso Illán Martínez del Santo</p>
        </div>
        <h1 className="text-5xl font-bold drop-shadow-lg text-gray-100">{title}</h1>
        <div className='w-48 text-end'>
            <p className='text-xs mb-1'>Javier Domingo Collado</p>
            <p className='text-xs mb-1'>Juan Miguel García González</p>
        </div>
    </header>
);

export default MyHeader;
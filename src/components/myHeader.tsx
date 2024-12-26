import React from 'react';

interface MyHeaderProps {
    title: string;
}

const MyHeader: React.FC<MyHeaderProps> = ({ title }) => (
    <header className="p-10 flex justify-center items-center text-white border-b-2 shadow-2xl">
        <h1 className="text-5xl font-bold drop-shadow-lg text-gray-100">{title}</h1>
    </header>
);

export default MyHeader;
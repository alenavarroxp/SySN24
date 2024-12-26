import { atom } from 'jotai';

export const cartItemsAtom = atom<number[]>([]);
export const totalPriceAtom = atom((get) =>
    get(cartItemsAtom).reduce((sum, index) => sum + get(productsAtom)[index].price, 0)
);
export const itemCountAtom = atom((get) => get(cartItemsAtom).length);

export interface Product {
    id: string;
    name: string;
    price: number;
}

export const productsAtom = atom<Product[]>([]);

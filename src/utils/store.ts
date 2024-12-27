import { atom } from 'jotai';

export const cartItemsAtom = atom<string[]>([]);
export const totalPriceAtom = atom((get) =>
    get(cartItemsAtom).reduce((sum, id) => {
      const product = get(productsAtom).find((product) => product.id === id);
      return product ? sum + product.price : sum;
    }, 0)
  );
  
export const itemCountAtom = atom((get) => get(cartItemsAtom).length);

export interface Product {
    id: string;
    name: string;
    price: number;
}

export const productsAtom = atom<Product[]>([]);

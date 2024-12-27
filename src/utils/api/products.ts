import { Product } from "../store";

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch('https://b7yrvbrh47.execute-api.us-east-1.amazonaws.com/Prod/products');
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const data = await response.json();
        if(!data.products) {
            throw new Error('Error fetching products');
        }
        return data.products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

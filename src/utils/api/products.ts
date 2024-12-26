import { Product } from "../store";

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch('https://your-api-endpoint.amazonaws.com/products');
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
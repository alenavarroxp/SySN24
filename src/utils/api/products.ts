import { Product } from "../store";

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch('https://ximav7a6y4.execute-api.us-east-1.amazonaws.com/Prod/products');
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

export const insertProduct = async (): Promise<Product> => {
    try {
        const response = await fetch('https://ximav7a6y4.execute-api.us-east-1.amazonaws.com/Prod/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error inserting product');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error("Error inserting product:", error);
        throw error;
    }
};

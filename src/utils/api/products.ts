import { Product } from "../store";

// Obtener la URL de la API Gateway desde las variables de entorno
const apiUrl = import.meta.env.VITE_API_GATEWAY_URL as string;

if (!apiUrl) {
  throw new Error("API_GATEWAY_URL no está definida en el archivo .env");
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${apiUrl}/products`);
    if (!response.ok) {
      throw new Error("Error fetching products");
    }
    const data = await response.json();
    if (!data.products) {
      throw new Error("Error fetching products");
    }
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const insertProduct = async (): Promise<Product> => {
  try {
    const response = await fetch(`${apiUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error inserting product");
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Error inserting product:", error);
    throw error;
  }
};

export const checkout = async (cartItems: string[]) => {
  try {
    const numericCartItems = cartItems.map((item) => Number(item));
    console.log(
      "Submitting cart:",
      JSON.stringify({ items: numericCartItems })
    );

    const response = await fetch(`${apiUrl}/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: numericCartItems }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error("Error submitting cart:", error);
  }
};

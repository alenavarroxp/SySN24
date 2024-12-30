import { useAtom } from "jotai";
import { useState } from "react";
import MyCart from "./components/cart/MyCart";
import MyHeader from "./components/myHeader";
import MyProducts from "./components/products/MyProducts";
import { checkout } from "./utils/api/products";
import { cartItemsAtom } from "./utils/store";

function App() {
  const [cartItems] = useAtom(cartItemsAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    setIsModalOpen(true);
    try {
      await checkout(cartItems);
      setMessage(`Checkout successful! Check your email.`);
    } catch (error) {
      console.error("Error during checkout:", error);
      setMessage(
        "There was an error processing your checkout. Please try again."
      );
    }
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage("");
    window.location.reload();
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-800 font-sysn24">
      <MyHeader title="SySN24 - Shop" />
      <MyProducts />
      <MyCart onCheckout={handleCheckout} />

      {/* Processing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white text-xl">
            <p>Processing checkout...</p>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {message && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">{message}</p>
              <p className="mt-4 text-sm text-gray-500">Please check your email for the PDF receipt and tracking information.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

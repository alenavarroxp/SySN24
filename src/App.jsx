import { useAtom } from "jotai";
import MyCart from "./components/cart/MyCart";
import MyHeader from "./components/myHeader";
import MyProducts from "./components/products/MyProducts";
import { checkout } from "./utils/api/products";
import { cartItemsAtom } from "./utils/store";

function App() {
  const [cartItems] = useAtom(cartItemsAtom);
  const handleCheckout = () => {
    checkout(cartItems)
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-800 font-sysn24">
      <MyHeader title="SySN24 - Shop"/>
      <MyProducts />
      <MyCart onCheckout={handleCheckout} />
    </div>
  );
}

export default App;

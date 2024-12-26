import MyCart from "./components/cart/MyCart";
import MyHeader from "./components/myHeader";
import MyProducts from "./components/products/MyProducts";

function App() {
  const handleCheckout = () => {
    console.log("Proceeding to checkout...");
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

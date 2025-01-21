import { FC, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { emptyCart, setCartState } from "../redux/features/cartSlice";
import CartRow from "./CartRow";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const Cart: FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.cartReducer.cartOpen);
  const items = useAppSelector((state) => state.cartReducer.cartItems);
  const [checkout, setCheckout] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    items.forEach((item) => {
      if (item.quantity) total += item.price * item.quantity;
    });
    return total.toFixed(0);
  };

  // Corrected _id extraction

  const rawData = localStorage.getItem("userdata");
  const dataArray = rawData ? JSON.parse(rawData) : [];
  const userid = dataArray.length > 0 ? dataArray[0]._id : null;
  const token = localStorage.getItem("authToken");

  const handlepayment = async () => {
    setCheckout(true);
    const stripe = await loadStripe(
      "pk_test_51QhkNeRTTxMNN0bCQpvHUy1QMOG9OQdT3vlBeoM0asFQtTOoNTUTluffhzlPakIzEfWdazYF8QpHfONH7i5tqE5z00tiRLhicm"
    );

    const body = {
      userId: userid,
      products: items.map((item: any) => ({
        product: item._id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:3000/order/createorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to checkout");
      }

      const data = await response.json();
      if (data.sessionId) {
        const result = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });
        
        if (result?.error) {
          throw new Error(result.error.message);
        }
      }
      
      setCheckout(false);
      toast.success("Your order has been confirmed", { duration: 3000 });
      dispatch(setCartState(false));
      dispatch(emptyCart());
    } catch (error) {
      toast.error("Failed to checkout", { duration: 3000 });
    }
  };

  const totalPrice = Array.isArray(items)
    ? items.reduce((acc, item) => acc + (item.price || 0), 0)
    : 0;

  const formatPrice = (price: number): string => {
    return price.toLocaleString("en-US", {});
  };

  const totalFormattedPrice = formatPrice(totalPrice);
  console.log("Total Price:", totalFormattedPrice);

  const handleOrder = () => {
    dispatch(setCartState(false));
    dispatch(emptyCart());
    setCheckout(false);
    toast.success("Your order has been confirmed", { duration: 3000 });
  };

  if (isOpen) {
    return (
      <div className="bg-[#0000007d] w-full min-h-screen fixed left-0 top-0 z-20 overflow-y-auto">
        {checkout ? (
          <div className="max-w-[400px] w-full min-h-full bg-white absolute right-0 top-0 p-6 font-karla dark:bg-slate-600 dark:text-white">
            <h1 className="font-bold text-xl mb-1">Checkout</h1>
            <p className="leading-4 mb-3">
              Welcome to the checkout section. This is being a development
              project, I haven't implemented any payment related task. If you
              click the cancel button you'll go back to the cart segment.
              Clicking confirm button will consider your order confirmed,
              payment done & also order delivered successfully. Another thing to
              mention, order history hasn't been developed due to not having a
              proper backend api.
            </p>
            <div className="flex items-center space-x-2">
              <span
                className="w-1/2 border border-gray-500 rounded cursor-pointer text-center py-1"
                onClick={() => setCheckout(false)}
              >
                Cancel
              </span>
              <span
                className="w-1/2 border border-gray-500 rounded cursor-pointer text-center py-1"
                onClick={handleOrder}
              >
                Confirm
              </span>
            </div>
          </div>
        ) : (
          <div className="max-w-[400px] w-full min-h-full bg-white absolute right-0 top-0 p-6 font-karla dark:bg-slate-600 dark:text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-2xl">Your Cart</h3>
              <RxCross1
                className="text-[24px] cursor-pointer hover:opacity-70"
                onClick={() => dispatch(setCartState(false))}
              />
            </div>
            <div className="mt-6 space-y-2">
              {items?.length > 0 ? (
                items.map((item) => <CartRow key={item._id} {...item} />)
              ) : (
                <div className="flex flex-col justify-center items-center p-4">
                  <img src="/emptyCart.jpg" alt="empty" className="w-40" />
                  <p className="text-center text-xl my-2">Your cart is empty</p>
                </div>
              )}
            </div>
            {items?.length > 0 && (
              <>
                <div className="flex items-center justify-between p-2">
                  <h2 className="font-bold text-2xl">Total</h2>
                  <h2 className="font-bold text-2xl">
                    Rs : {calculateTotal()}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handlepayment}
                  className="w-full text-center text-white bg-blue-500 py-2 my-4 rounded font-bold text-xl hover:bg-blue-700"
                >
                  CHECKOUT
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Cart;

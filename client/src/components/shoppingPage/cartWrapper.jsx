import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cardItemContext";
import { useEffect, useRef } from "react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const totalCartAmount = cartItems?.length
    ? cartItems.reduce((sum, item) => {
        const price = item.salePrice > 0 ? item.salePrice : item.price;
        return sum + price * item.quantity;
      }, 0)
    : 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [cartItems]);

  return (
    <SheetContent className="sm:max-w-md flex flex-col">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div
        ref={scrollRef}
        className="mt-5 flex-1 overflow-y-auto space-y-4 pr-2"
      >
        {cartItems?.map((item) => (
          <UserCartItemsContent key={item.productId || item._id} cartItem={item} />
        ))}
      </div>
      {cartItems?.length === 0 && (
        <div className="text-center text-muted-foreground mt-3 ">
          Your cart is empty
        </div>
      )}
      <div className="mt-7 space-y-4 border-t pt-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${totalCartAmount.toFixed(2)}</span>
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full bg-rose-800 text-white hover:bg-rose-700"
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;

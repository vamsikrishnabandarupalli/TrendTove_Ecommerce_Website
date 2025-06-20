import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cardItemContext";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount = cartItems?.length
    ? cartItems.reduce((sum, item) => {
        const price = item.salePrice > 0 ? item.salePrice : item.price;
        return sum + price * item.quantity;
      }, 0)
    : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems?.map((item) => (
          <UserCartItemsContent key={item.productId || item._id} cartItem={item} />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6 bg-rose-800 text-white hover:bg-rose-700"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;

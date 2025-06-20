import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleUpdateQuantity = (item, action) => {
    if (action === "plus") {
      const currentCart = cartItems.items || [];
      const cartIndex = currentCart.findIndex((i) => i.productId === item.productId);
      const productIndex = productList.findIndex((p) => p._id === item.productId);
      const stock = productList[productIndex]?.totalStock || 0;

      if (cartIndex > -1) {
        const currentQty = currentCart[cartIndex].quantity;
        if (currentQty + 1 > stock) {
          toast({
            title: `Only ${currentQty} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: item.productId,
        quantity: action === "plus" ? item.quantity + 1 : item.quantity - 1,
      })
    ).then(({ payload }) => {
      if (payload?.success) {
        toast({ title: "Cart item is updated successfully" });
      }
    });
  };

  const handleCartItemDelete = (item) => {
    dispatch(deleteCartItem({ userId: user?.id, productId: item.productId })).then(
      ({ payload }) => {
        if (payload?.success) {
          toast({ title: "Cart item is deleted successfully" });
        }
      }
    );
  };

  const price = (cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price) * cartItem.quantity;

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem.image}
        alt={cartItem.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-bold">{cartItem.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-5 w-5 rounded-full"
            size="icon"
            disabled={cartItem.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem.quantity}</span>
          <Button
            variant="outline"
            className="h-5 w-5 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">${price.toFixed(2)}</p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={15}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;

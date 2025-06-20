import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dilogbox";
import { Separator } from "../ui/seperator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-ratings";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  const handleRatingChange = (newRating) => setRating(newRating);

  const handleAddToCart = (productId, totalStock) => {
    const currentCartItems = cartItems.items || [];
    const existingItemIndex = currentCartItems.findIndex(
      (item) => item.productId === productId
    );
    if (existingItemIndex > -1) {
      const currentQuantity = currentCartItems[existingItemIndex].quantity;
      if (currentQuantity + 1 > totalStock) {
        toast({
          title: `Only ${currentQuantity} quantity can be added for this item`,
          variant: "destructive",
        });
        return;
      }
    }
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then(
      (res) => {
        if (res?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Product is added to cart" });
        }
      }
    );
  };

  const handleDialogChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      dispatch(setProductDetails());
      setRating(0);
      setReviewMsg("");
    }
  };

  const handleAddReview = () => {
    if (!productDetails?._id) return;
    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((res) => {
      if (res.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id));
        toast({ title: "Review added successfully!" });
      } else {
        toast({
          title: "Failed to add review",
          variant: "destructive",
        });
      }
    });
  };

  useEffect(() => {
    if (productDetails) dispatch(getReviews(productDetails._id));
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        className="h-screen md:h-auto max-w-[100vw] p-2 sm:p-4 md:p-6 lg:p-8 max-h-screen overflow-y-auto" aria-describedby="product-dialog-description"
      >
        <DialogTitle>{productDetails?.title || "Product Details"}</DialogTitle>
        <DialogDescription
          id="product-dialog-description"
          className="sr-only"
          role="note"
        >
          Details and reviews for the product {productDetails?.title}
        </DialogDescription>

        <div className="flex flex-col lg:flex-row gap-y-5 lg:gap-x-8 h-full">
          <div className="w-full lg:w-[40%] flex justify-center items-center min-h-[200px] ">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="max-w-full max-h-[250px] object-contain rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="overflow-y-auto lg:w-[60%] p-2 pr-4 max-h-[75vh] scrollbar-thin">
            <h1 className="text-lg sm:text-xl font-extrabold break-words">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 mb-3 break-words">
              {productDetails?.description}
            </p>

            <div className="flex items-center justify-between">
              <p
                className={`text-lg font-bold text-primary ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-lg font-bold text-muted-foreground">
                  ${productDetails.salePrice}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <StarRatingComponent rating={averageReview} />
              <span className="text-muted-foreground text-sm">
                ({averageReview.toFixed(2)})
              </span>
            </div>

            <div className="mt-5 mb-5">
              {productDetails?.totalStock === 0 ? (
                <Button
                  className="w-full opacity-60 cursor-not-allowed bg-rose-800"
                  disabled
                >
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full bg-rose-800 hover:bg-rose-700 text-white"
                  onClick={() =>
                    handleAddToCart(productDetails._id, productDetails.totalStock)
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>

            <Separator />

            <div className="mt-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Reviews</h2>
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div className="flex gap-4" key={review._id || review.userId}>
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {review.userName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{review.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={review.reviewValue} />
                        </div>
                        <p className="text-muted-foreground text-sm break-words">
                          {review.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No Reviews</p>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <Label>Write a review</Label>
                <div className="flex items-center gap-2 mt-2">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Write a review..."
                />
                <Button
                  onClick={handleAddReview}
                  className="mt-2 bg-rose-800 hover:bg-rose-700 text-white"
                  disabled={reviewMsg.trim() === "" || rating === 0}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;

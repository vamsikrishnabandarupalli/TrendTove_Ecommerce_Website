import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}
      variant="outline"
      size="icon"
      className={`transition-colors ${
        star <= rating
          ? "text-yellow-500"
          : "text-muted-foreground hover:text-yellow-500"
      } border-none`}
      onClick={handleRatingChange ? () => handleRatingChange(star) : undefined}
    >
      <StarIcon
        className={`w-4 h-6 ${star <= rating ? "fill-yellow-500" : "fill-none"}`}
      />
    </Button>
  ));
}

export default StarRatingComponent;

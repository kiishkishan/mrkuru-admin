import { Star } from "lucide-react";
import React, { memo } from "react";

type RatingProps = {
  rating: number;
};

const Rating = memo(({ rating }: RatingProps) => {
  console.log("rating component");
  // Calculate the full stars and half stars
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating % 1 >= 0.5; // Check if there should be a half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Empty stars to complete 5 stars

  return (
    <>
      {/* Render full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} color="#FFC107" className="w-4 h-4" />
      ))}
      {/* Render half star if needed */}
      {hasHalfStar && (
        <Star key="half" color="#FFC107" className="w-4 h-4 opacity-50" />
      )}
      {/* Render empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <Star key={`empty-${index}`} color="#E4E5E9" className="w-4 h-4" />
      ))}
    </>
  );
});

// Display a custom name for better debugging in React DevTools
Rating.displayName = "Rating";

export default Rating;

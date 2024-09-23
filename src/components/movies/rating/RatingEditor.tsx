import { useState } from "react";
import { Popcorn } from "lucide-react";

import "./styles.css";

export default function RatingEditor() {
  const [rating, setRating] = useState(0);
  const [halfRating, setHalfRating] = useState(false);

  const handleClick = (index: number) => {
    if (rating === index + 1 && !halfRating) {
      setHalfRating(true);
      setRating(index + 0.5);
    } else if (rating === index + 0.5) {
      setHalfRating(false);
      setRating(index);
    } else {
      setHalfRating(false);
      setRating(index + 1);
    }
  };

  const renderPopcorn = (index: number) => {
    const iconIndex = index + 1;

    if (rating >= iconIndex) {
      return <Popcorn className="icon-thick text-primary h-6 w-6" />;
    } else if (rating === iconIndex - 0.5 && halfRating) {
      return (
        <div className="relative h-6 w-6 overflow-hidden">
          <Popcorn className="absolute inset-0 text-primary clip-half-left icon-thick" />
          <Popcorn className="absolute inset-0 text-gray-300 clip-half-right icon-thick" />
        </div>
      );
    } else {
      return <Popcorn className="icon-thick text-gray-300 h-6 w-6" />;
    }
  };

  return (
    <div className="flex space-x-2">
      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className="cursor-pointer"
        >
          {renderPopcorn(index)}
        </div>
      ))}
    </div>
  );
}

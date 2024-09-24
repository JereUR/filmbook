import { useEffect, useState } from "react";
import { Loader2, Popcorn } from "lucide-react";

import "./styles.css";
import { useSession } from "@/app/(main)/SessionProvider";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface RatingEditorProps {
  movieId: string;
}

export default function RatingEditor({ movieId }: RatingEditorProps) {
  const [rating, setRating] = useState<number>(0);
  const [halfRating, setHalfRating] = useState(false);
  const { user } = useSession();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["rating", movieId, user?.id],
    queryFn: () =>
      kyInstance.get(`/api/movie/rating/${movieId}`).json<number | null>(),
    initialData: null,
  });

  useEffect(() => {
    if (data) setRating(data);
  }, [data]);

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
      return (
        <Popcorn className="icon-thick h-10 w-10 cursor-pointer text-primary" />
      );
    } else if (rating === iconIndex - 0.5 && halfRating) {
      return (
        <div className="relative h-10 w-10 cursor-pointer overflow-hidden">
          <Popcorn className="clip-half-left icon-thick absolute inset-0 h-10 w-10 text-primary" />
          <Popcorn className="clip-half-right icon-thick absolute inset-0 h-10 w-10 text-gray-300" />
        </div>
      );
    } else {
      return (
        <Popcorn className="icon-thick h-10 w-10 cursor-pointer text-gray-300" />
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
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
      {isLoading || isFetching ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : (
        <span className="text-sm font-semibold">Puntuar</span>
      )}
    </div>
  );
}

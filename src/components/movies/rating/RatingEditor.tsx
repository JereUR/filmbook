import { useEffect, useState } from "react";
import { Popcorn } from "lucide-react";

import { useSubmitRatingMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/components/ui/use-toast";

interface RatingEditorProps {
  movieId: string;
  ownRating: number | null;
}

export default function RatingEditor({
  movieId,
  ownRating,
}: RatingEditorProps) {
  const [rating, setRating] = useState<number>(ownRating ? ownRating : 0);
  const [halfRating, setHalfRating] = useState<boolean>(false);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const { toast } = useToast();
  const mutation = useSubmitRatingMutation();

  useEffect(() => {
    if (ownRating) {
      setRating(ownRating);
      setHalfRating(ownRating % 1 !== 0); 
    } else {
      setRating(0);
      setHalfRating(false);
    }
  }, [ownRating]);

  const handleClick = (index: number) => {
    setOnEdit(true);
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

  const handleSubmit = () => {
    mutation.mutate(
      { rating, movieId },
      {
        onSuccess: () => {
          setOnEdit(false);
          toast({
            description: "Rating actualizado con éxito.",
          });
        },
      },
    );
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
      <span className="text-sm font-semibold">Puntuar</span>
      {onEdit && (
        <LoadingButton
          loading={mutation.isPending}
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          Guardar
        </LoadingButton>
      )}
    </div>
  );
}

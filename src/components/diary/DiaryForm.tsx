import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";

import '@/components/movies/rating/styles.css'
import noImage from "@/assets/no-image-film.jpg";
import { ReviewInfo, SearchMovie } from "@/lib/types";
import { formatArgDate, getYear } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import ReviewEditorSection from "./ReviewEditorSection";

interface MovieItemProps {
  movie: SearchMovie | null;
  changeState: () => void;
  handleOpenChange: (open: boolean) => void;
}

export default function DiaryForm({ movie, changeState, handleOpenChange }: MovieItemProps) {
  const [reviewState, setReviewState] = useState<ReviewInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const searchReview = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/movie/review/movie/${id}`,
      );
      const data: ReviewInfo = await response.json();

      if (data) {
        setReviewState(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Error al obtener los datos: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchReview();
  }, [])

  if (!movie) return null

  const { title, release_date, poster_path, genre_names, id } = movie

  return <div className='relative'>
    <button
      className="absolute group -top-10 flex gap-1 items-center p-2 bg-card border border-muted text-xs md:text-sm text-foreground/40 rounded-2xl"
      onClick={changeState}
    >
      <ChevronLeft className="w-5 h-5 group-hover:scale-[1.3] transition-transform duration-500 ease-in-out" />
      <span className="text-sm md:text-base">
        Volver
      </span>
    </button>
    <div className="m-5 md:m-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg md:text-xl font-semibold">{title} ({getYear(release_date)})</h1>
          <span className='text-sm md:text-base text-foreground/40'>Día: {formatArgDate(new Date().toISOString())} (USA)</span>
        </div>
        <div className="relative h-28 w-16">
          <Image
            src={
              poster_path
                ? poster_path
                : noImage
            }
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded"
          />
        </div>
      </div>
      <div>
        {loading ?
          <span className='flex items-center gap-2 text-center'>
            <Loader2 className="animate-spin" />
            <p className="text-foreground/40">Buscando si existe review realizada...</p>
          </span>
          : <ReviewEditorSection movieId={id.toString()} ownRating={reviewState ? reviewState.rating : 0} reviewText={reviewState ? reviewState.review : ''} liked={reviewState ? reviewState.liked : false} handleOpenChange={handleOpenChange} />}
      </div>
    </div>
  </div>
}
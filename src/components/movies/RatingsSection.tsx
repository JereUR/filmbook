import Image from "next/image";

import TmdbLogo from "@/assets/TMDB.png";
import AppLogo from "@/assets/logo.png";

interface RatingsSectionProps {
  rating: any;
  voteAverage?: number;
  voteCount?: number;
}

export default function RatingsSection({
  rating,
  voteAverage,
  voteCount,
}: RatingsSectionProps) {
  function ratingColor(rating: number) {
    if (rating < 4.0) {
      return "text-red-600";
    } else if (rating < 6.0) {
      return "text-yellow-600";
    } else if(rating<9.0){
      return "text-green-600";
    }else{
      return "text-primary";
    }
  }

  return (
    <div className="w-full my-2 md:my-4 md:w-1/4 flex flex-col gap-2 rounded-2xl border border-primary/50 p-2 md:p-6">
      <div className="flex gap-4 items-center justify-center">
        <h1 className="text-lg md:text-xl font-bold">RATING</h1>
      </div>
      <div className="flex md:flex-col gap-2">
      <div className="flex md:flex-col pr-4 border-r md:pr-0 md:border-r-0 md:pb-4 md:border-b">
        <div className="flex items-center gap-4">
          <div className="relative h-8 w-8 flex-shrink-0 md:h-14 md:w-14">
            <Image
              src={TmdbLogo}
              alt="TMDB logo"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="rounded"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            {voteAverage ? (
              <div className="flex gap-1 text-2xl italic">
                <span className={ratingColor(voteAverage)}>{voteAverage.toFixed(1)}</span>
                <span className="text-gray-400">/10</span>
              </div>
            ) : (
              <span className="text-2xl text-center text-foreground/40">S/P</span>
            )}
            <span className="text-xs text-muted-foreground">
              Votos: {voteCount ? voteCount : "-"}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 pl-1 md:pl-0 md:pt-1">
          <div className="relative h-8 w-8 flex-shrink-0 md:h-14 md:w-14">
            <Image
              src={AppLogo}
              alt="Filmbook logo"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="rounded"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            {rating ? (
              <div className="flex gap-1 text-2xl italic">
                <span className={ratingColor(rating.averageRating)}>
                  {rating.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-400">/5</span>
              </div>
            ) : (
              <span className="text-2xl text-center text-foreground/40">S/P</span>
            )}
            <p className="text-xs text-muted-foreground">
              Votos: {rating ? rating.numberOfRatings : "-"}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

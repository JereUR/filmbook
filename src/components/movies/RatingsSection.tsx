import Image from "next/image"

import TmdbLogo from "@/assets/TMDB.png";
import AppLogo from "@/assets/logo.png";

interface RatingsSectionProps{
  rating:any
  voteAverage?:number
  voteCount?:number
}

export default function RatingsSection({rating,voteAverage,voteCount}:RatingsSectionProps){
  return(<div className="md:1/4 flex gap-4 border p-2 md:p-6 md:flex-col rounded-2xl">
    <div>
      <div className="flex gap-4 items-center">
        {voteAverage?<h1>{voteAverage}/10</h1>:<h1>Sin puntación</h1>}
        <div className="relative w-10 h-10 flex-shrink-0 md:h-14 md:w-14">
          <Image
            src={TmdbLogo}
            alt="TMDB logo"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="rounded"
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground md:text-base">
        Votos: {voteCount? voteCount:'-'}
      </p>
    </div>
    <div>
      <div className="flex gap-4 items-center">
        {rating?<h1>{rating.averageRating}/5</h1>:<h1>Sin puntación</h1>}
        <div className="relative w-10 h-10 flex-shrink-0 md:h-14 md:w-14">
          <Image
            src={AppLogo}
            alt="Filmbook logo"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="rounded"
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground md:text-base">
        Votos: {rating? rating.numberOfRatings:'-'}
      </p>
    </div>
  </div>)
}
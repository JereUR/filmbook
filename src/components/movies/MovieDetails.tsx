import Image from "next/image";

import { Movie } from "@/lib/types";
import { getYear } from "@/lib/utils";
import noImagePath from '@/assets/no-image-film.jpg'

interface MovieDetailsProps {
  movie: Movie;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const {
    overview,
    runtime,
    title,
    director,
    releaseDate,
    backdropPath,
    productionCompanies,
    productionCountries,
    cast,
    genres,
    platforms,
    posterPath,
    spokenLanguages,
    voteAverage,
    voteCount,
  } = movie;

  return (
    <div className="relative w-full">
      {backdropPath && (
        <div className="relative w-full h-[50vh] rounded-t-md overflow-hidden">
          <Image
            src={backdropPath}
            alt="Backdrop"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 w-full h-full"
            quality={100}
            priority
          />
          <div
            className='absolute inset-0 bg-gradient-to-t 
              from-primary/30 dark:from-card to-transparent'
          />
        </div>
      )}

      <div className="relative z-10 p-6 text-foreground bg-card/50 flex gap-5">
      <div>
        <Image
          src={posterPath? posterPath : noImagePath}
          alt="Poster"
          width={180}
          height={270}
          layout="fixed"
        />
      </div>
        <div>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p>{director.name}</p>
          <p>
            {getYear(releaseDate ? releaseDate.toString() : "")} • {runtime} mins
          </p>
          <p className="mt-4">{overview}</p>
        </div>
      </div>
    </div>
  );
}

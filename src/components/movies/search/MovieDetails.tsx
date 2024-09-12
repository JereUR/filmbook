import Image from "next/image";

import { Movie } from "@/lib/types";
import { getYear } from "@/lib/utils";

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
    <div className="relative flex flex-col md:flex-row w-full gap-4">
      {backdropPath && (
        <div className="relative w-full md:w-1/2 lg:w-2/3 h-auto">
          <Image
            src={backdropPath}
            alt="Backdrop"
            width={1920}
            height={1080}
            className="rounded-lg object-cover w-full h-auto"
            quality={100}
            priority
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 p-6 text-white">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p>{director.name}</p>
        <p>
          {getYear(releaseDate ? releaseDate.toString() : "")} • {runtime} mins
        </p>
      </div>
    </div>
  );
}

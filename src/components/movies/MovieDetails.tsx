import Image from "next/image";

import { Movie, Director } from "@/lib/types";
import { getYear } from "@/lib/utils";
import noImagePath from "@/assets/no-image-film.jpg";
import CircularImage from "./CircularImage";

interface MovieDetailsProps {
  movie: Movie;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const {
    overview,
    runtime,
    title,
    directors,
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

  console.log({ productionCompanies });
  console.log({ productionCountries });
  console.log({ genres });
  console.log({ directors });
  console.log({ cast });
  console.log({ platforms });
  console.log({ spokenLanguages });
  console.log({ voteAverage });
  console.log({ voteCount });

  return (
    <div className="relative w-full">
      {backdropPath && (
        <div className="relative h-[50vh] w-full overflow-hidden rounded-t-md">
          <Image
            src={backdropPath}
            alt="Backdrop"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 h-full w-full"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent dark:from-card" />
        </div>
      )}

      <div className="relative z-10 flex items-center gap-8 bg-card/50 p-6 text-foreground">
        <div className="relative my-auto h-40 w-28 flex-shrink-0">
          <Image
            src={posterPath ? posterPath : noImagePath}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded"
          />
        </div>
        <div className="flex flex-col space-y-3">
          <h1 className="text-4xl font-bold">{title}</h1>
          {directors.map((director: Director) => (
            <div key={director.id} className="flex items-center gap-3">
              <CircularImage
                src={director.profilePath}
                alt={`${director.name} avatar`}
              />
              <div className='flex flex-col'>
                <span className="text-muted-foreground">{director.name}</span>
                <span className="text-primary text-sm">
                  Director
                </span>
              </div>
            </div>
          ))}
          <p className="font-medium text-foreground/70">
            {getYear(releaseDate ? releaseDate.toString() : "")} • {runtime}{" "}
            mins
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {overview}
          </p>
        </div>
      </div>
      <hr className="mx-auto w-5/6 font-extralight" />
    </div>
  );
}

import Image from "next/image";

import noImagePath from "@/assets/no-image-film.jpg";
import { Movie, Director } from "@/lib/types";
import { getYear } from "@/lib/utils";
import CircularImage from "./CircularImage";
import RatingsSection from "./RatingsSection";

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
    rating
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
  console.log({ rating });

  return (
    <div className="relative w-full">
      {backdropPath && (
        <div className="relative h-[30vh] w-full overflow-hidden rounded-t-md md:h-[40vh] lg:h-[50vh]">
          <Image
            src={backdropPath}
            alt="Backdrop"
            fill
            className="absolute inset-0 h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent dark:from-card" />
        </div>
      )}

      <div className="relative z-10 bg-card/50 p-4 text-foreground">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-col items-start gap-4 md:w-3/4 md:flex-row md:items-center md:gap-8">
            <div className="flex items-start gap-4 md:gap-8">
              <div className="relative h-24 w-16 flex-shrink-0 md:h-40 md:w-28">
                <Image
                  src={posterPath ? posterPath : noImagePath}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="rounded"
                />
              </div>
              <div className="flex flex-col space-y-3">
                <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                  {title} ({getYear(releaseDate ? releaseDate.toString() : "")})
                </h1>
                {directors.map((director: Director) => (
                  <div
                    key={director.id}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    <CircularImage
                      src={director.profilePath}
                      alt={`${director.name} avatar`}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground md:text-base">
                        {director.name}
                      </span>
                      <span className="text-xs text-primary md:text-sm">
                        Director
                      </span>
                    </div>
                  </div>
                ))}
                <p className="text-sm font-light italic text-foreground/40 md:text-base">
                  {runtime} mins -{" "}
                  {genres.map((genre: any) => genre.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
          <RatingsSection rating={rating} voteAverage={voteAverage} voteCount={voteCount}/>
        </div>
        <div className="mt-4 px-1 md:mt-6 md:px-4">
          <p className="text-justify text-sm leading-relaxed text-foreground/40 md:text-base">
            {overview}
          </p>
        </div>
      </div>
      <hr className="mx-auto w-4/5 font-extralight md:w-5/6" />
      <div></div>
    </div>
  );
}

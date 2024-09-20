import Image from "next/image";

import type { Movie, CastMember, CrewMember } from "@/lib/types";
import RatingsSection from "./RatingsSection";
import ProvidersInfo from "./ProvidersInfo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import TitleSection from "./TitleSection";
import CastMemberShow from "./CastMemberShow";
import CrewMemberShow from "./CrewMemberShow";

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
    crew,
    genres,
    providers,
    posterPath,
    spokenLanguages,
    voteAverage,
    voteCount,
    rating,
  } = movie;

  console.log({ productionCompanies });
  console.log({ productionCountries });
  console.log({ genres });
  console.log({ spokenLanguages });
  console.log({ crew });

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
          <div className="absolute -inset-10 bg-gradient-to-t from-primary/30 to-transparent dark:from-card md:inset-0" />
        </div>
      )}

      <div className="relative z-10 bg-card/50 p-4 text-foreground">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-col items-start gap-2 md:w-3/4 md:flex-row md:items-center md:gap-4">
            <TitleSection
              title={title}
              releaseDate={releaseDate}
              posterPath={posterPath}
              runtime={runtime}
              genres={genres}
              directors={directors}
            />
          </div>
          <RatingsSection
            rating={rating}
            voteAverage={voteAverage}
            voteCount={voteCount}
          />
        </div>
        <div className="mt-2 px-1 md:mt-3 md:px-4">
          <p className="text-justify text-sm leading-relaxed text-foreground/40 md:text-base">
            {overview}
          </p>
        </div>
      </div>
      <ProvidersInfo providersList={providers} />

      {/* Cast section */}

      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-4">
        <h2
          className="text-lg text-foreground/40 underline md:text-xl lg:text-2xl font-light"
          style={{ textUnderlineOffset: "3px" }}
        >
          Reparto
        </h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="mx-auto w-full overflow-visible md:max-w-xl lg:max-w-3xl"
        >
          <CarouselContent className="-ml-1">
            {cast.map((member: CastMember, index: number) => (
              <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                <CastMemberShow member={member} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-4">
        <h2
          className="text-lg text-foreground/40 underline md:text-xl lg:text-2xl font-light"
          style={{ textUnderlineOffset: "3px" }}
        >
          Equipo
        </h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="mx-auto w-full overflow-visible md:max-w-xl lg:max-w-3xl"
        >
          <CarouselContent className="-ml-1">
            {crew.map((member: CrewMember) => (
              <CarouselItem key={member.id} className="basis-1/2 md:basis-1/3">
                <CrewMemberShow member={member} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
}

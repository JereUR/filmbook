import Image from "next/image";

import type { Movie, CastMember, CrewMember } from "@/lib/types";
import RatingsSection from "./RatingsSection";
import ProvidersInfo from "./ProvidersInfo";

import TitleSection from "./TitleSection";
import CastMemberShow from "./CastMemberShow";
import CrewMemberShow from "./CrewMemberShow";
import CrewCastSection from "./CrewCastSection";
import GeneralInfoSection from "./GeneralInfoSection";

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
      <GeneralInfoSection
        title={title}
        releaseDate={releaseDate}
        posterPath={posterPath}
        runtime={runtime}
        genres={genres}
        directors={directors}
        rating={rating}
        voteAverage={voteAverage}
        voteCount={voteCount}
        overview={overview}
      />
      <ProvidersInfo providersList={providers} />
      <CrewCastSection cast={cast} crew={crew} />
    </div>
  );
}

import { CrewMember,ImageInfo } from "@/lib/types";
import TitleSection from "./TitleSection";
import RatingsSection from "./rating/RatingsSection";

interface GeneralInfoSectionProps {
  id:string
  title: string;
  releaseDate: Date | undefined;
  posterPath: string | undefined;
  runtime: number;
  genres: any[];
  directors: CrewMember[];
  rating: any;
  voteAverage?: number;
  voteCount?: number;
  overview: string;
  handleImageClick:(image:ImageInfo)=>void
}

export default function GeneralInfoSection({
  id,
  title,
  releaseDate,
  posterPath,
  runtime,
  genres,
  directors,
  rating,
  voteAverage,
  voteCount,
  overview,
  handleImageClick
}: GeneralInfoSectionProps) {
  return (
    <>
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
              handleImageClick={handleImageClick}
            />
          </div>
          <RatingsSection
            movieId={id}
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
    </>
  );
}

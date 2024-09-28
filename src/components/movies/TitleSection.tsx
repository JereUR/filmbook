import Image from "next/image";
import { CrewMember, ImageInfo } from "@/lib/types";
import { getYear } from "@/lib/utils";
import noImagePath from "@/assets/no-image-film.jpg";

import CrewMemberShow from "./CrewMemberShow";
import { Eye, Heart } from "lucide-react";

interface TitleSectionProps {
  posterPath: string | undefined;
  title: string;
  releaseDate: Date | undefined;
  runtime: number;
  genres: any[];
  directors: CrewMember[];
  watched: boolean;
  liked: boolean;
  handleImageClick: (image: ImageInfo) => void;
}

export default function TitleSection({
  posterPath,
  title,
  releaseDate,
  runtime,
  genres,
  directors,
  watched,
  liked,
  handleImageClick,
}: TitleSectionProps) {
  const image: ImageInfo = {
    src: posterPath ? posterPath : noImagePath,
    name: title,
  };
  const year = releaseDate ? getYear(releaseDate.toString()) : null;

  return (
    <div className="flex items-start gap-4 md:gap-8">
      <div className="relative h-24 w-16 flex-shrink-0 md:h-40 md:w-28">
        <Image
          src={posterPath ? posterPath : noImagePath}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="cursor-pointer rounded"
          onClick={() => handleImageClick(image)}
        />
        <div className="absolute inset-0 flex items-end justify-center mb-1">
          <div className="bg-black/70 p-1 rounded flex space-x-2">
            <Eye
              className={`h-5 w-5 text-foreground/70 ${
                watched ? "fill-primary" : "fill-white/50"
              }`}
            />
            <Heart
              className={`h-5 w-5 text-foreground/70 ${
                liked ? "fill-red-500 dark:fill-red-600" : "fill-white/50"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
          {title} {year ? `(${year})` : ""}
        </h1>
        {directors.map((director: CrewMember) => (
          <CrewMemberShow
            key={director.id}
            member={director}
            handleImageClick={handleImageClick}
          />
        ))}
        <p className="text-sm font-light italic text-foreground/40 md:text-base">
          {runtime} mins - {genres.map((genre: any) => genre.name).join(", ")}
        </p>
      </div>
    </div>
  );
}

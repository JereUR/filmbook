import Image from "next/image";

import { CrewMember,ImageInfo} from "@/lib/types";
import { getYear } from "@/lib/utils";
import noImagePath from "@/assets/no-image-film.jpg";
import CrewMemberShow from "./CrewMemberShow";

interface TitleSectionProps{
  posterPath:string|undefined
  title: string
  releaseDate: Date|undefined
  runtime: number
  genres: any[]
  directors: CrewMember[]
  handleImageClick:(image:ImageInfo)=>void
}

export default function TitleSection({
  posterPath,
  title,
  releaseDate,
  runtime,
  genres,
  directors,
  handleImageClick
}:TitleSectionProps){
  const image:ImageInfo={
    src:posterPath ? posterPath : noImagePath,
    name:title
  }

  return(<div className="flex items-start gap-4 md:gap-8">
    <div className="relative h-24 w-16 flex-shrink-0 md:h-40 md:w-28">
      <Image
        src={posterPath ? posterPath : noImagePath}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="rounded cursor-pointer"
        onClick={()=>handleImageClick(image)}
      />
    </div>
    <div className="flex flex-col space-y-3">
      <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
        {title} {getYear(releaseDate ? `(${releaseDate.toString()})` : "")}
      </h1>
      {directors.map((director: CrewMember) => (
        <CrewMemberShow
          key={director.id}
          member={director}
          handleImageClick={handleImageClick}
        />
      ))}
      <p className="text-sm font-light italic text-foreground/40 md:text-base">
        {runtime} mins -{" "}
        {genres.map((genre: any) => genre.name).join(", ")}
      </p>
    </div>
  </div>)
}
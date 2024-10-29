import { CastMember, CrewMember, ImageInfo } from "@/lib/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel"
import CastMemberShow from "./CastMemberShow"
import CrewMemberShow from "./CrewMemberShow"

interface CrewCastSectionProps {
  cast: CastMember[]
  crew: CrewMember[]
  handleImageClick: (image: ImageInfo) => void
}

export default function CrewCastSection({ cast, crew, handleImageClick }: CrewCastSectionProps) {
  return (
    <>
      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-4">
        <h2
          className="font-light text-foreground/40 underline lg:text-lg ml-1 md:ml-0"
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
              <CarouselItem
                key={`${index}-${member.name}`}
                className="basis-1/2 md:basis-1/3"
              >
                <CastMemberShow member={member} handleImageClick={handleImageClick} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden transition-colors duration-300 ease-in-out hover:text-primary disabled:hover:text-foreground/40 md:flex" />
          <CarouselNext className="hidden transition-colors duration-300 ease-in-out hover:text-primary disabled:hover:text-foreground/40 md:flex" />
        </Carousel>
      </div>
      <hr className="h-[1px] bg-primary/40 border-none mx-5 my-2 md:mx-12 md:my-5" />
      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-4">
        <h2
          className="font-light text-foreground/40 underline lg:text-lg ml-1 md:ml-0"
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
            {crew.map((member: CrewMember, index: number) => (
              <CarouselItem
                key={`${index}-${member.id}`}
                className="basis-1/2 md:basis-1/3"
              >
                <CrewMemberShow member={member} handleImageClick={handleImageClick} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden transition-colors duration-300 ease-in-out hover:text-primary disabled:hover:text-foreground/40 md:flex" />
          <CarouselNext className="hidden transition-colors duration-300 ease-in-out hover:text-primary disabled:hover:text-foreground/40 md:flex" />
        </Carousel>
      </div>
    </>
  )
}

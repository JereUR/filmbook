import { CastMember, CrewMember } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import CastMemberShow from "./CastMemberShow";
import CrewMemberShow from "./CrewMemberShow";

interface CrewCastSectionProps {
  cast: CastMember[];
  crew: CrewMember[];
}

export default function CrewCastSection({ cast, crew }: CrewCastSectionProps) {
  return (
    <>
      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-4">
        <h2
          className="text-lg font-light text-foreground/40 underline md:text-xl lg:text-2xl"
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
          <CarouselPrevious className="hidden md:flex transition-colors duration-300 ease-in-out disabled:hover:text-foreground/40 hover:text-primary" />
          <CarouselNext className="hidden md:flex transition-colors duration-300 ease-in-out disabled:hover:text-foreground/40  hover:text-primary" />
        </Carousel>
      </div>
      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-4">
        <h2
          className="text-lg font-light text-foreground/40 underline md:text-xl lg:text-2xl"
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
          <CarouselPrevious className="hidden md:flex transition-colors duration-300 ease-in-out disabled:hover:text-foreground/40  hover:text-primary" />
          <CarouselNext className="hidden md:flex transition-colors duration-300 ease-in-out disabled:hover:text-foreground/40  hover:text-primary" />
        </Carousel>
      </div>
    </>
  );
}

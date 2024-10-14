import Image from "next/image";
import Link from "next/link";
import { ArrowBigDownDashIcon, ArrowBigUpDashIcon } from "lucide-react";
import { useState } from "react";

import { WatchlistData } from "@/lib/types";
import { getYear, ratingColor } from "@/lib/utils";
import noImage from "@/assets/no-image-film.jpg";
import TmdbLogo from "@/assets/TMDB.png";
import ProvidersInfo from "@/components/movies/ProvidersInfo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface WatchlistItemProps {
  item: WatchlistData
}

export default function WatchlistItem({ item }: WatchlistItemProps) {
  const [open, setOpen] = useState(false);
  const { title, releaseDate, posterPath, genres, voteAverage, overview, providers } = item.movie

  console.log({ item })

  return (
    <div 
      className="m-1 cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-background p-2 transition-colors duration-300 ease-in-out hover:bg-background/40 md:p-4"
    >
      <Link className="flex gap-2 md:gap-4" href={`/pelicula/${item.movieId}?title=${title}&date=${getYear(releaseDate ? releaseDate.toString() : '')}`}>
        <div className="flex-none">
          <Image
            src={posterPath ? posterPath : noImage}
            alt={`${title} poster`}
            width={100}
            height={120}
            className="rounded"
          />
        </div>
        <div className="flex flex-grow flex-col justify-center gap-1 md:gap-2">
          <h1 className="text-sm md:text-base font-semibold">
            <span className="line-clamp-2 whitespace-pre-line">{title}</span> (
            {releaseDate ? getYear(releaseDate.toString()) : "N/A"})
          </h1>
          {overview && <p className='text-xs text-foreground/40 text-justify italic'>{overview}</p>}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex gap-1 font-semibold italic md:text-lg">
              <span className={voteAverage ? ratingColor(voteAverage) : ''}>
                {voteAverage ? voteAverage.toFixed(1) : "N/A"}
              </span>
              <span className="text-gray-400">/10</span>
            </div>
            <Image
              src={TmdbLogo}
              width={25}
              height={25}
              alt="TMDB logo"
              className="rounded"
            />
          </div>
        </div>
      </Link>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className="border-1 border-primary/50 bg-background text-sm hover:bg-background/50 md:text-base"
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Donde ver
            {open?<ArrowBigUpDashIcon className="ml-2 h-4 w-4 md:h-6 md:w-6 shrink-0 opacity-50" />:<ArrowBigDownDashIcon className="ml-2 h-4 w-4 md:h-6 md:w-6 shrink-0 opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full" >
          <ProvidersInfo providers={providers} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, Clock, Star, Film, Video } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import useGoldenGlobeNominees from "@/hooks/useGoldenGlobeNominees"
import { useIsMobile } from "@/hooks/useIsMobile"
import { ImageInfo } from "@/lib/types"

interface GoldenGlobeNominationsMoviesProps {
  handleImageClick: (image: ImageInfo) => void
}

export default function GoldenGlobeNominationsMovies({ handleImageClick }: GoldenGlobeNominationsMoviesProps) {
  const { nominationsMovie } = useGoldenGlobeNominees()
  const isMobile = useIsMobile()

  const handleClick = (nominee: any) => {
    if (isMobile) {
      window.open(`/pelicula/${nominee.id}?title=${encodeURIComponent(nominee.title)}&date=2024`, '_blank', 'noopener,noreferrer')
    } else {
      handleImageClick({ src: nominee.posterPath, name: nominee.title })
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {nominationsMovie.map(({ category, nominees, winner }) => (
        <div key={category} className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">{category}</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {nominees.map((nominee) => (
              <Card
                key={`${category} - ${nominee.id}`}
                className={`group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${winner === nominee.title ? "ring-2 sm:ring-4 ring-yellow-500" : ""
                  }`}
              >
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
                  onClick={() => handleClick(nominee)}
                >
                  <Image
                    src={nominee.posterPath}
                    alt={`${nominee.title} poster`}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/pelicula/${nominee.id}?title=${encodeURIComponent(nominee.title)}&date=2024`}
                      aria-label={`Ver información de ${nominee.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='hover:underline'
                      onClick={(e) => isMobile && e.preventDefault()}
                    >
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center px-1 sm:px-2">
                        {nominee.title} {winner === nominee.title && "🏆"}
                      </h3>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-2 sm:p-4 space-y-1 sm:space-y-2">
                  <Link
                    href={`/pelicula/${nominee.id}?title=${encodeURIComponent(nominee.title)}&date=2024`}
                    aria-label={`Ver información de ${nominee.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-orange font-medium hover:underline block text-xs sm:text-base truncate"
                  >
                    {nominee.title}
                  </Link>
                  <div className="flex items-center text-xs sm:text-sm md:text-base text-gray-600">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="truncate">{nominee.releaseDate}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm md:text-base text-gray-600">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span>{nominee.runtime} min</span>
                  </div>
                  {nominee.voteAverage !== null && (
                    <div className="flex items-center text-xs sm:text-sm md:text-base text-gray-600">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span>{nominee.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs sm:text-sm md:text-base text-gray-600">
                    <Film className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="truncate">{nominee.genres.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm md:text-base text-gray-600">
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="truncate">{nominee.directors.slice(0, 2).join(", ")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


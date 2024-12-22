"use client"

import Image from "next/image"
import Link from "next/link"
import { Music, Info } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useGoldenGlobeNominees from "@/hooks/useGoldenGlobeNominees"
import { ImageInfo } from "@/lib/types"

interface GoldenGlobeNominationsSongProps {
  handleImageClick: (image: ImageInfo) => void
}

export default function GoldenGlobeNominationsSong({ handleImageClick }: GoldenGlobeNominationsSongProps) {
  const { nominationsOriginalSong } = useGoldenGlobeNominees()

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2">
      {nominationsOriginalSong.map(({ category, nominees, winner }) => (
        <div key={category} className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">{category}</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {nominees.map((nominee) => (
              <Card
                key={`${category} - ${nominee.name}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${winner === nominee.name ? "ring-2 sm:ring-4 ring-yellow-500" : ""
                  }`}
              >
                <div
                  className="group relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick({ src: nominee.posterPath || '/placeholder.svg', name: nominee.name })}
                >
                  <Image
                    src={nominee.posterPath || '/placeholder.svg'}
                    alt={`${nominee.name} poster`}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center px-1 sm:px-2">
                      {nominee.name} {winner === nominee.name && "🏆"}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-2 sm:p-4 h-full space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold text-sm sm:text-base text-primary truncate">{nominee.name}</p>
                    {nominee.movieId ? (
                      <Link
                        href={`/pelicula/${nominee.movieId}?title=${encodeURIComponent(nominee.movieTitle)}&date=2024`}
                        aria-label={`Ver información de ${nominee.movieTitle}`}
                        title={nominee.movieTitle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-orange text-xs sm:text-sm hover:underline block truncate"
                      >
                        {nominee.movieTitle}
                      </Link>
                    ) : (
                      <p className="text-gray-600 text-xs sm:text-sm truncate">{nominee.movieTitle}</p>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-xs sm:text-sm text-foreground/40">
                          <Music className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">{nominee.composers.join(", ")}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start" className="max-w-[200px]">
                        <p className="text-xs">{nominee.composers.join(", ")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {nominee.providers && nominee.providers.length > 0 && (
                    <div className="flex justify-between items-start space-x-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {nominee.providers.map((provider, index) => (
                          <Image
                            key={index}
                            src={provider}
                            alt="Provider logo"
                            width={24}
                            height={24}
                            className="rounded-full"
                            unoptimized
                          />
                        ))}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Plataformas disponibles en Argentina (actualizado al 21 de Diciembre del 2024)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, Star, Film, Video } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import useGoldenGlobeNominees from "@/hooks/useGoldenGlobeNominees"
import { ImageInfo } from "@/lib/types"

interface GoldenGlobeNominationsMoviesProps {
  handleImageClick: (image: ImageInfo) => void
}

export default function GoldenGlobeNominationsMovies({ handleImageClick }: GoldenGlobeNominationsMoviesProps) {
  const { nominationsMovie } = useGoldenGlobeNominees()

  return (
    <div className="container mx-auto px-4 py-2">
      {nominationsMovie.map(({ category, nominees, winner }) => (
        <div key={category} className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {nominees.map((nominee) => (
              <Card
                key={`${category} - ${nominee.id}`}
                className={`group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${winner === nominee.title ? "ring-4 ring-yellow-500" : ""
                  }`}
              >
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick({ src: nominee.posterPath, name: nominee.title })}
                >
                  <Image
                    src={nominee.posterPath}
                    alt={`${nominee.title} poster`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-xl font-bold text-center px-2">
                      {nominee.title} {winner === nominee.title && "🏆"}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  <Link
                    href={`/pelicula/${nominee.id}?title=${encodeURIComponent(nominee.title)}&date=2024`}
                    aria-label={`Ver información de ${nominee.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-orange font-medium hover:underline block"
                  >
                    {nominee.title}
                  </Link>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>{nominee.releaseDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{nominee.runtime} min</span>
                  </div>
                  {nominee.voteAverage !== null && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2" />
                      <span>{nominee.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Film className="w-4 h-4 mr-2" />
                    <span>{nominee.genres.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Video className="w-4 h-4 mr-2" />
                    <span>{nominee.directors.slice(0, 2).join(", ")}</span>
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


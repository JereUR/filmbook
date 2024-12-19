import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import useGoldenGlobeNominees from "@/hooks/useGoldenGlobeNominees"
import { ImageInfo } from "@/lib/types"

interface GoldenGlobeNominationsPersonsProps {
  handleImageClick: (image: ImageInfo) => void
}

export default function GoldenGlobeNominationsPersons({ handleImageClick }: GoldenGlobeNominationsPersonsProps) {
  const { nominationsPerson } = useGoldenGlobeNominees()

  return (
    <div className="container mx-auto p-4">
      {nominationsPerson.map(({ category, nominees, winner }) => (
        <div key={category} className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {nominees.map((nominee) => (
              <Card
                key={`${category} - ${nominee.name}`}
                className={`group overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg ${winner === nominee.name ? "ring-4 ring-yellow-500" : ""
                  }`}
                onClick={() => handleImageClick({ src: nominee.photo, name: nominee.name })}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={nominee.photo}
                    alt={`${nominee.name} photo`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"

                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-xl font-bold text-center px-2">
                      {nominee.name} {winner === nominee.name && "🏆"}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  {nominee.movieId ? (
                    <Link
                      href={`/pelicula/${nominee.movieId}?title=${encodeURIComponent(
                        nominee.movieTitle
                      )}&date=2024`}
                      className="text-primary-orange font-medium hover:underline block text-center"
                      aria-label={`Ver información de ${nominee.movieTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {nominee.movieTitle}
                    </Link>
                  ) : (
                    <p className="text-gray-600 text-center">{nominee.name}</p>
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


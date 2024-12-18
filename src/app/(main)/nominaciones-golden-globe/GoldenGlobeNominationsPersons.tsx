import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card" // ShadCN Component
import useGoldenGlobePersons from "@/hooks/useGoldenGlobePersons"

export default function GoldenGlobeNominationsPersons() {
  const { nominationsArray } = useGoldenGlobePersons()

  return (
    <div className="container mx-auto p-4">
      {nominationsArray.map(({ category, name, nominees, winner }) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <p className="text-muted-foreground mb-4">{name}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nominees.map((nominee) => (
              <li key={nominee.name}>
                <Card
                  className={`relative group h-full overflow-hidden ${winner === nominee.name ? "border-4 border-yellow-500" : ""
                    }`}
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={nominee.photo}
                      alt={nominee.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:brightness-50 transition duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition duration-300">
                      <h3 className="text-white text-xl font-bold">
                        {nominee.name} {winner === nominee.name && "🏆"}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="flex justify-center items-center">
                    {nominee.movieId && (
                      <Link
                        href={`/pelicula/${nominee.movieId}?title=${encodeURIComponent(
                          nominee.movieTitle
                        )}&date=2024`}
                        className="text-primary-orange font-medium hover:underline"
                        aria-label={`Ver información de ${nominee.movieTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {nominee.movieTitle}
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { Trophy, BadgeInfo, Star, Film } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import noImage from '@/assets/no-image-film.jpg'
import { Button } from "@/components/ui/button"

interface DynamicNomineeCardProps {
    nominee: {
        id: string
        name: string
        photo?: string | null
        movieTitle?: string | null
        movieId?: string | null
        providers?: any
        composers?: string | null
    }
    isWinner?: boolean
    isPredicted?: boolean
    isFavorite?: boolean
    onSelectPrediction?: (nomineeId: string) => void
    onSelectFavorite?: (nomineeId: string) => void
    onImageClick?: (image: { src: string; name: string }) => void
}

export default function DynamicNomineeCard({
    nominee,
    isWinner,
    isPredicted,
    isFavorite,
    onSelectPrediction,
    onSelectFavorite,
    onImageClick
}: DynamicNomineeCardProps) {
    const imageSrc = nominee.photo || noImage

    return (
        <Card
            className={`overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${isWinner
                ? "ring-2 sm:ring-4 ring-yellow-500 relative animate-pulse-slow"
                : (isPredicted || isFavorite)
                    ? "ring-2 ring-primary"
                    : ""
                }`}
        >
            <div
                className="group relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
                onClick={() => onImageClick?.({ src: typeof imageSrc === 'string' ? imageSrc : '', name: nominee.name })}
            >
                {isWinner && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 opacity-20 z-10"></div>
                )}
                <Image
                    src={imageSrc}
                    alt={`${nominee.name} photo`}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    unoptimized
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 gap-2">
                    <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center px-1 sm:px-2">
                        {nominee.name} {isWinner && "🏆"}
                    </h3>
                    <div className="flex gap-2">
                        {onSelectPrediction && (
                            <Button
                                size="sm"
                                variant={isPredicted ? "default" : "secondary"}
                                onClick={(e) => { e.stopPropagation(); onSelectPrediction(nominee.id); }}
                            >
                                {isPredicted ? "Predicho" : "Predecir"}
                            </Button>
                        )}
                        {onSelectFavorite && (
                            <Button
                                size="sm"
                                variant={isFavorite ? "default" : "secondary"}
                                onClick={(e) => { e.stopPropagation(); onSelectFavorite(nominee.id); }}
                            >
                                {isFavorite ? "Mi Favorito" : "Favorito"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <CardContent className="p-2 sm:p-4 space-y-2">
                <TooltipProvider>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1 min-w-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p className={`font-semibold text-sm sm:text-lg truncate cursor-default flex items-center gap-2 ${isWinner ? "text-yellow-500" : "text-primary"}`}>
                                        {nominee.name}
                                        {/* {isWinner && <Trophy className="inline w-4 h-4 ml-1 text-yellow-500" />} */}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{nominee.name}</p>
                                </TooltipContent>
                            </Tooltip>
                            {nominee.movieTitle && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {nominee.movieId ? (
                                            <Link
                                                href={`/pelicula/${nominee.movieId}?title=${encodeURIComponent(nominee.movieTitle)}`}
                                                className="text-primary-orange text-xs sm:text-sm hover:underline flex items-center gap-2 truncate"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Film className="size-4 flex-shrink-0" />
                                                <span className="truncate">{nominee.movieTitle}</span>
                                            </Link>
                                        ) : (
                                            <p className="text-foreground/40 text-xs sm:text-sm flex items-center gap-2 truncate cursor-default">
                                                <Film className="size-4 flex-shrink-0" />
                                                <span className="truncate">{nominee.movieTitle}</span>
                                            </p>
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">{nominee.movieTitle}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {nominee.composers && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-foreground/40 text-xs flex items-center gap-2 truncate italic cursor-default">
                                            <BadgeInfo className="size-4 flex-shrink-0" />
                                            <span className="truncate">{nominee.composers}</span>
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-[300px] text-xs leading-relaxed">{nominee.composers}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        {isWinner && (
                            <div className="text-yellow-500">
                                <Trophy className="w-5 h-5 animate-bounce" />
                            </div>
                        )}
                    </div>

                    {isPredicted && (
                        <div className="text-xs font-bold text-primary flex items-center">
                            <Star className="size-4 mr-1 fill-primary" /> Predicción
                        </div>
                    )}
                    {isFavorite && (
                        <div className="text-xs font-bold text-primary-orange flex items-center">
                            <Star className="size-4 mr-1 fill-primary-orange" /> Favorito
                        </div>
                    )}

                    {nominee.providers && nominee.providers.length > 0 && (
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex -space-x-2 overflow-hidden">
                                {nominee.providers.map((provider: string, index: number) => (
                                    <Image
                                        key={index}
                                        src={provider}
                                        alt="Provider logo"
                                        width={20}
                                        height={20}
                                        className="rounded-full border border-background"
                                        unoptimized
                                    />
                                ))}
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <BadgeInfo className="size-4 text-foreground/40 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">Plataformas disponibles</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </TooltipProvider>
            </CardContent>
        </Card>
    )
}

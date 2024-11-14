'use client'

import { useState } from "react";
import { ChevronDown, ChevronUp, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

import { TournamentDate } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import noImage from '@/assets/no-image-film.jpg'
import Link from "next/link";

interface DateItemProps {
  dateData: TournamentDate
}

export default function DateItem({ dateData }: DateItemProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { date, movie, visible, extraPoints, extraPointsSolution } = dateData

  if (!visible) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="relative w-full justify-between border border-primary/40 bg-background text-xs hover:bg-background/50 md:text-sm"
          onClick={() => setOpen(!open)}
        >
          {extraPoints && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          )}
          Fecha {date}
          {open ? (
            <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4 z-[200] border border-primary/40">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Image
              src={movie.posterPath || noImage}
              alt={movie.title}
              width={64}
              height={90}
              className="rounded"
            />
            <div className="flex flex-col gap-2">
              <span className="md:text-lg font-semibold">Fecha {date}</span>
              <span className="text-sm md:text-base text-muted-foreground/70">{movie.title}</span>
            </div>
          </div>
          {extraPointsSolution && (
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                Puntos extras:
              </span>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {extraPointsSolution}
              </p>
            </div>
          )}
          <Button className="w-full">
            <Link
              href={`/pelicula/${movie.id}?title=${movie.title}`}
              className="flex items-center justify-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver info de película <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
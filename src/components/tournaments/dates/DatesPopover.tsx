import { Dispatch, useState } from "react"
import Image from "next/image"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateForTournamentData, InputDateTournamentProps } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import noImage from '@/assets/no-image-film.jpg'
import { ShowMovie } from "./EditDateToTournamentDialog"

interface DatesPopoverProps {
  dates: DateForTournamentData[]
  loading: boolean
  status: string
  input: InputDateTournamentProps
  setInput: Dispatch<React.SetStateAction<InputDateTournamentProps>>
  setOriginalMovie: Dispatch<React.SetStateAction<ShowMovie | null>>
}

export default function DatesPopover({ dates, loading, status, input, setInput, setOriginalMovie }: DatesPopoverProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { date } = input

  const handleDateClick = (dateClick: DateForTournamentData) => {
    const { dateId, date, movie, visible, extraPoints, extraPointsSolution } = dateClick
    setOriginalMovie(movie)
    setInput(() => ({ dateId, date, movieId: movie.id, visible, extraPoints, extraPointsSolution }))
    setOpen(false)
  }

  if (loading) {
    return (
      <p className='flex text-xs md:text-sm text-muted-foreground/40 items-center gap-2'><Loader2 className='animate-spin' /> Cargando fechas...</p>
    )
  }

  return (
    <div>
      <Label htmlFor="dateInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
        Fechas
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[300px] justify-between border border-primary/40 bg-background text-xs hover:bg-background/50 md:text-sm"
          >
            {date
              ? `Fecha ${dates.find((d) => d.date === date)?.date}`
              : "Seleccione un fecha"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
          <Command className="max-h-[300px]">
            <CommandInput placeholder="Buscar fechas..." />
            <CommandList className="scrollbar-thin overflow-auto">
              {loading ? (
                <CommandEmpty>Cargando Fechas...</CommandEmpty>
              ) : status === 'error' ? (
                <CommandEmpty>Error al cargar fechas...</CommandEmpty>
              ) : Array.isArray(dates) && dates.length > 0 ? (
                <CommandGroup heading="Fechas">
                  {dates.map((d) => (
                    <CommandItem
                      key={d.dateId}
                      onSelect={() => handleDateClick(d)}
                      className="cursor-pointer data-[selected='true']:bg-transparent"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={d.movie.posterPath || noImage}
                          alt={d.movie.title}
                          width={48}
                          height={72}
                          className="rounded"
                        />
                        <span>
                          Fecha {d.date} - {d.movie.title}
                        </span>
                        {date === d.date && (
                          <Check className="ml-auto h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>Sin resultados.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
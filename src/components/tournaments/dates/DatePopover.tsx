import { Dispatch, useState } from "react"
import Image from "next/image"
import { Check, ChevronsUpDown } from "lucide-react"

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
    const { dateId, date, movie, visible } = dateClick
    setOriginalMovie(movie)
    setInput(() => ({ dateId, date, movieId: movie.id, visible }))
    setOpen(false)
  }

  if (loading) {
    return (
      <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
        <Command className="max-h-[300px]">
          <CommandInput placeholder="Buscar fechas..." />
          <CommandList className="scrollbar-thin overflow-auto">
            <CommandEmpty>Cargando Fechas...</CommandEmpty>
          </CommandList>
        </Command>
      </PopoverContent>
    )
  }

  if (status === 'error') {
    return (
      <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
        <Command className="max-h-[300px]">
          <CommandInput placeholder="Buscar fechas..." />
          <CommandList className="scrollbar-thin overflow-auto">
            <CommandEmpty>Error al cargar fechas...</CommandEmpty>
          </CommandList>
        </Command>
      </PopoverContent>
    )
  }

  return (
    <div>
      <Label htmlFor="dateInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
        Fechas
      </Label>
      <Popover key={open ? 'open-date-popover' : 'closed-date-popover'} open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className="border border-primary/40 bg-background text-xs hover:bg-background/50 md:text-sm z-[200]"
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[300px] justify-between"
          >
            {date ?
              `Fecha ${dates.find((d) => d.date === date)?.date}`
              : "Seleccione un fecha"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
          <Command className="max-h-[300px]">
            <CommandInput placeholder="Buscar Datese..." />
            <CommandList className="scrollbar-thin overflow-auto">
              <CommandEmpty>Sin resultados.</CommandEmpty>
              <CommandGroup heading="Dateses">
                {Array.isArray(dates) && dates.length > 0 ? (
                  dates.map((d) => (
                    <CommandItem
                      key={d.dateId}
                      onSelect={() => handleDateClick(d)}
                      className={`cursor-pointer data-[selected='true']:bg-transparent`}
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
                  ))
                ) : (
                  <CommandEmpty>Sin resultados.</CommandEmpty>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )

}
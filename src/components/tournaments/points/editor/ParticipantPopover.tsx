'use client'

import { Dispatch, useState } from "react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { InputAssignPointsProps, ParticipantsData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ParticipantPopoverProps {
  participants: ParticipantsData[]
  loadingParticipants: boolean
  participantIdSelected: string | null
  setInput: Dispatch<React.SetStateAction<InputAssignPointsProps>>
}

export default function ParticipantPopover({ participants, loadingParticipants, participantIdSelected, setInput }: ParticipantPopoverProps) {
  const [open, setOpen] = useState<boolean>(false)

  const handleParticipantClick = (participantId: string) => {
    setInput((prevInput) => ({ ...prevInput, participantId }))
    setOpen(false)
  }

  if (loadingParticipants) {
    return (
      <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
        <Command className="max-h-[300px]">
          <CommandInput placeholder="Buscar participante..." />
          <CommandList className="scrollbar-thin overflow-auto">
            <CommandEmpty>Cargando participantes...</CommandEmpty>
          </CommandList>
        </Command>
      </PopoverContent>
    )
  }

  return (
    <div>
      <Label htmlFor="dateInput" className="block text-md font-medium text-muted-foreground/40 mb-1">
        Participante
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
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
            {participantIdSelected ?
              `${participants.find((participant) => participant.id === participantIdSelected)?.name} (${participants.find((participant) => participant.id === participantIdSelected)?.nickname})`
              : "Seleccione un participante"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-2 z-[200] border border-primary/40">
          <Command className="max-h-[300px]">
            <CommandInput placeholder="Buscar participante..." />
            <CommandList className="scrollbar-thin overflow-auto">
              <CommandEmpty>Sin resultados.</CommandEmpty>
              <CommandGroup heading="Participantes">
                {Array.isArray(participants) && participants.length > 0 ? (
                  participants.map((participant) => (
                    <CommandItem key={participant.id} className={`cursor-pointer data-[selected='true']:bg-transparent`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => handleParticipantClick(participant.id)}
                      >
                        <div className="flex items-center gap-2">
                          {participant.name} {participant.nickname && `(${participant.nickname})`}
                          {participantIdSelected === participant.id && (
                            <Check className="ml-auto h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </Button>
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
'use client'

import { TournamentData } from "@/lib/types";
import TournamentMoreButton from "./TournamentMoreButton";
import { dateFormat } from "@/lib/utils";
import Link from "next/link";

interface TournamentItemProps {
  tournament: TournamentData
  admin: boolean
}

export default function TournamentItem({ tournament, admin }: TournamentItemProps) {
  const { id, name, description, dates, participants, createdAt, endDate } = tournament;

  return (
    <Link href={`/torneos/${id}`} className="relative p-2 md:p-5 border border-primary/40 rounded-2xl cursor-pointer bg-background hover:bg-background/70 transition-colors duration-300 ease-in-out">
      {admin && (
        <TournamentMoreButton
          tournament={tournament}
          className="absolute top-3 right-3"
        />
      )}
      <div className="flex gap-2 justify-center items-end mb-2 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold">{name}</h2>
        <p className={`text-center text-xs md:text-sm font-medium ${endDate ? 'text-orange-500 dark:text-orange-600' : 'text-green-500 dark:text-green-600'}`}>{endDate ? 'Inactivo' : 'Activo'}</p>
      </div>
      <p className={`text-sm md:text-base text-muted-foreground/40 italic ${!description && 'text-center'}`}>{description ? description : 'Sin descripción'}</p>
      <div className="flex justify-around py-2 md:py-4 my-3 md:my-6 border border-muted rounded-2xl">
        <p>Fechas: {dates}</p>
        <p>Participantes: {participants}</p>
      </div>
      <p className='text-light text-xs md:text-sm italic text-muted-foreground/40'>Creado: {dateFormat(createdAt.toISOString())}</p>
    </Link>
  );
}
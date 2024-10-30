import { TournamentData } from "@/lib/types";
import TournamentMoreButton from "./TournamentMoreButton";

interface TournamentItemProps {
  tournament: TournamentData
  admin: boolean
}

export default async function TournamentItem({ tournament, admin }: TournamentItemProps) {
  const { id, name, description, dates, participants, createdAt } = tournament;

  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Fechas: {dates}</p>
      <p>Participantes: {participants}</p>
      <p>Creado: {new Date(createdAt).toLocaleString()}</p>
      {admin && (
        <TournamentMoreButton
          tournament={tournament}
        />
      )}
    </div>
  );
}
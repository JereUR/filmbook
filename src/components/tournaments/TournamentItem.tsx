import { TournamentData } from "@/lib/types";

interface TournamentItemProps {
  tournament: TournamentData
}

export default function TournamentItem({ tournament }: TournamentItemProps) {
  const { id, name, description, dates, participants, createdAt } = tournament;

  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Fechas: {dates}</p>
      <p>Participantes: {participants}</p>
      <p>Creado: {new Date(createdAt).toLocaleString()}</p>
    </div>
  );
}
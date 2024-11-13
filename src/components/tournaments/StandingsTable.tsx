import { Medal } from 'lucide-react';

import './styles.css'
import { ParticipantTournament } from "@/lib/types";
import Linkify from '../Linkify';

interface StandingsTableProps {
  tournamentId: string;
  standings: ParticipantTournament[];
}

export default function StandingsTable({ tournamentId, standings }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg animate-fade-in">
      <table className="w-full border-collapse bg-background">
        <thead>
          <tr className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
            <th className="px-4 py-3 text-left font-semibold">Puesto</th>
            <th className="px-4 py-3 text-left font-semibold">Participante</th>
            <th className="px-4 py-3 text-right font-semibold">Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((participant, index) => (
            <tr
              key={participant.participantId}
              className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
            >
              <td className="px-4 py-3 flex items-center">
                {index < 3 ? (
                  <Medal className={`w-5 h-5 mr-2 ${index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                      'text-amber-600'
                    }`} />
                ) : null}
                <span className={index < 3 ? 'font-semibold' : ''}>{index + 1}</span>
              </td>
              <td className="px-4 py-3">
                <Linkify>
                  <div className="font-medium">{participant.participantName}</div>
                  {participant.participantUsername !== '' && <div className="text-sm text-muted-foreground">@{participant.participantUsername}</div>}
                </Linkify>
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {participant.tournaments.find(t => t.tournamentId === tournamentId)?.totalPoints ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
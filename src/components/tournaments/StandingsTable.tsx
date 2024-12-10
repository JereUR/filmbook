'use client'

import { Medal } from 'lucide-react'
import Image from 'next/image'

import { ParticipantTournament } from "@/lib/types"
import logo from '@/assets/logo.png'
import Link from 'next/link'

interface StandingsTableProps {
  tournamentId: string
  standings: ParticipantTournament[]
}

export default function StandingsTable({ tournamentId, standings }: StandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl shadow-lg animate-fade-in bg-card">
      <div className="w-full">
        <div className="flex bg-gradient-to-r from-primary to-primary-dark text-foreground p-4">
          <div className="text-left font-bold flex-1 text-sm uppercase tracking-wider">Puesto</div>
          <div className="text-left font-bold flex-[2] text-sm uppercase tracking-wider">Participante</div>
          <div className="text-right font-bold flex-1 text-sm uppercase tracking-wider">Puntuación</div>
        </div>
        <div className="divide-y divide-border">
          {standings.map((participant, index) => (
            <div
              key={participant.participantId}
              className={`flex items-center transition-colors hover:bg-primary/10 ${index % 2 === 0 ? 'bg-background' : 'bg-secondary/30'
                }`}
            >
              <div className="px-4 py-4 flex items-center flex-1">
                {index < 3 ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-300' :
                      'bg-amber-600'
                    }`}>
                    <Medal className="w-5 h-5 text-background" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                )}
              </div>
              <div className="px-4 py-4 flex-[2]">
                <div className="font-semibold text-foreground">
                  {participant.participantNickname || participant.participantName}
                </div>
                {participant.participantUsername && (
                  <div className="flex items-center mt-1">
                    <Image
                      src={logo}
                      alt="App Logo"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    <Link href={`/usuarios/${participant.participantUsername}`}>
                      <div className="text-sm text-primary hover:underline">
                        @{participant.participantUsername}
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              <div className="px-4 py-4 text-right font-bold flex-1 text-lg">
                {participant.tournaments.find(t => t.tournamentId === tournamentId)?.totalPoints ?? 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


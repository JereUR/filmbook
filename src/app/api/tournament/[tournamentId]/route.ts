import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdmin } from "@/auth";
import { Tournament, ParticipantTournament, TournamentDate } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { tournamentId: string } },
) {
  const { user: loggedInUser, admin } = await validateAdmin();

  if (!loggedInUser && !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: params.tournamentId,
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      participants: {
        select: {
          participant: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      dates: {
        select: {
          id: true,
          date: true,
          movie: {
            select: {
              id: true,
              title: true,
            },
          },
          scores: {
            select: {
              participant: {
                select: {
                  id: true,
                  name: true,
                },
              },
              points: true,
              extraPoints: true,
            },
          },
        },
      },
    },
  });

  if (!tournament) {
    return NextResponse.json(null);
  }

  const participants: ParticipantTournament[] = tournament.participants.map(
    (p) => ({
      participantId: p.participant.id,
      participantName: p.participant.name,
      participantUsername: p.participant.username,
    }),
  );

  const dates: TournamentDate[] = tournament.dates.map((d) => ({
    id: d.id,
    date: d.date,
    movie: {
      id: d.movie.id,
      title: d.movie.title,
    },
    scores: d.scores.map((s) => ({
      participantId: s.participant.id,
      participantName: s.participant.name,
      points: s.points,
      extraPoints: s.extraPoints || 0,
    })),
  }));

  const tournamentData: Tournament = {
    id: tournament.id,
    name: tournament.name,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    participants,
    dates,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
  };

  return NextResponse.json(tournamentData);
}

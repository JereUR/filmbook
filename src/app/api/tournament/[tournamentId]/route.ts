import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdmin } from "@/auth";
import { TournamentData } from "@/lib/types";

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
      description: true,
      createdAt: true,
      updatedAt: true,
      participants: {
        select: {
          id: true,
          tournamentId: true,
          name: true,
          username: true,
          tournamentEntries: {
            select: {
              id: true,
              tournamentId: true,
              participantId: true,
              totalPoints: true,
              createdAt: true,
              tournamentMovies: {
                select: {
                  id: true,
                  movieId: true,
                  matchWeek: true,
                  points: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
      entries: {
        select: {
          id: true,
          participantId: true,
          tournamentId: true,
          totalPoints: true,
          createdAt: true,
          tournamentMovies: {
            select: {
              id: true,
              movieId: true,
              matchWeek: true,
              points: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!tournament) {
    return NextResponse.json(null);
  }

  const tournamentData: TournamentData = {
    id: params.tournamentId,
    name: tournament.name,
    description: tournament.description,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
    participants: tournament.participants.map((participant) => ({
      id: participant.id,
      name: participant.name,
      username: participant.username,
      tournamentId: participant.tournamentId,
      tournamentEntries: participant.tournamentEntries.map((entry) => ({
        id: entry.id,
        participantId: entry.participantId,
        tournamentId: entry.tournamentId,
        totalPoints: entry.totalPoints,
        createdAt: entry.createdAt,
        tournamentMovies: entry.tournamentMovies.map((movie) => ({
          id: movie.id,
          movieId: movie.movieId,
          matchWeek: movie.matchWeek,
          points: movie.points,
          createdAt: movie.createdAt,
        })),
      })),
    })),
    entries: tournament.entries.map((entry) => ({
      id: entry.id,
      participantId: entry.participantId,
      tournamentId: entry.tournamentId,
      totalPoints: entry.totalPoints,
      createdAt: entry.createdAt,
      tournamentMovies: entry.tournamentMovies.map((movie) => ({
        id: movie.id,
        movieId: movie.movieId,
        matchWeek: movie.matchWeek,
        points: movie.points,
        createdAt: movie.createdAt,
      })),
    })),
  };

  return NextResponse.json(tournamentData);
}

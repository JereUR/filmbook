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
          name: true,
          username: true,
          tournamentEntries: {
            select: {
              id: true,
              tournamentId: true,
              tournamentMovie: {
                select: {
                  id: true,
                  movieId: true,
                  createdAt: true,
                },
              },
              createdAt: true,
            },
          },
        },
      },
      entries: {
        select: {
          id: true,
          tournamentMovie: {
            select: {
              id: true,
              movieId: true,
              createdAt: true,
            },
          },
          tournamentParticipantId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!tournament) {
    return NextResponse.json(null);
  }

  const tournamentData: TournamentData = {
    id: tournament.id,
    name: tournament.name,
    description: tournament.description,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
    participants: tournament.participants.map((participant) => ({
      id: participant.id,
      name: participant.name,
      username: participant.username,
      tournamentEntries: participant.tournamentEntries.map((entry) => ({
        id: entry.id,
        tournamentId: entry.tournamentId,
        tournamentMovie: entry.tournamentMovie
          ? {
              id: entry.tournamentMovie.id,
              movieId: entry.tournamentMovie.movieId,
              createdAt: entry.tournamentMovie.createdAt,
            }
          : null,
        createdAt: entry.createdAt,
      })),
    })),
    entries: tournament.entries.map((entry) => ({
      id: entry.id,
      tournamentMovie: entry.tournamentMovie
        ? {
            id: entry.tournamentMovie.id,
            movieId: entry.tournamentMovie.movieId,
            createdAt: entry.tournamentMovie.createdAt,
          }
        : null,
      tournamentId: params.tournamentId,
      createdAt: entry.createdAt,
    })),
  };

  return NextResponse.json(tournamentData);
}

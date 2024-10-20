import { NextRequest } from "next/server";

import { validateAdmin } from "@/auth";
import prisma from "@/lib/prisma";
import { TournamentsPage } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user, admin } = await validateAdmin();

    if (!user && !admin) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }

    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      tournaments.length > pageSize ? tournaments[pageSize].id : null;

    const data: TournamentsPage = {
      tournaments: tournaments.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    );
  }
}

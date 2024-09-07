import { NextRequest } from "next/server";

import { TMDBResponse } from "@/lib/types";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || "";
  const apiKey = process.env.MOVIE_API_KEY;
  const accessToken = process.env.MOVIE_ACCESS_TOKEN;

  if (!title || typeof title !== "string") {
    return new Response(JSON.stringify({ error: "Parametro sin valor." }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error al buscar películas: ${response.statusText}`);
    }

    const data: TMDBResponse = await response.json();
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error Interno del Servidor." }),
      { status: 500 },
    );
  }
}


import prisma from "@/lib/prisma";
import { fetchMovieFromTMDB } from "@/lib/tmdb";
import { Movie } from "@/lib/types";
import { isAfter, subWeeks } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const movieId = req.nextUrl.searchParams.get("id") || "";

  if (!movieId) {
    return NextResponse.json({ error: "ID de película no proporcionado" }, { status: 400 });
  }

  // Buscar la película en la base de datos
  let movie = await prisma.movie.findUnique({
    where: { id: movieId },
    select:{
      id: true,
      title: true,
      backdropPath:true,
      posterPath : true,
      releaseDate: true,
      overview: true,
      runtime: true,
      voteAverage: true,
      voteCount:true,
      productionCompanies: true,
      spokenLanguages: true,
      productionCountries: true,
      genres: true,
      director: true,
      cast: true,
      platforms: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  // Si la película existe, verificar si han pasado más de 7 días
  if (movie) {
    const oneWeekAgo = subWeeks(new Date(), 1);

    if (isAfter(oneWeekAgo, movie.updatedAt)) {
      const movieData = await fetchMovieFromTMDB(movieId);

      movie = await prisma.movie.update({
        where: { id: movieId },
        data: {
          voteAverage: movieData.vote_average,
          voteCount:movieData.vote_count,
          platforms: movieData.platforms,
        },
      });
    }

    return NextResponse.json(movie);
  }

  // Si la película no existe, hacer fetch a la API y crearla en la base de datos
  try {
    const movieData = await fetchMovieFromTMDB(movieId);

    const {title,backdrop_path,poster_path,release_date,overview,runtime,vote_average,vote_count,production_companies,spoken_languages,production_countries,genres,director,cast,platforms}=movieData

    const newMovie: Movie = {
      id: movieId,
      title: title,
      backdropPath:backdrop_path,
      posterPath: poster_path,
      releaseDate: new Date(release_date),
      overview: overview,
      runtime: runtime,
      voteAverage: vote_average,
      voteCount:vote_count,
      productionCompanies: production_companies,
      spokenLanguages: spoken_languages,
      productionCountries: production_countries,
      genres: genres,
      director: director ? { name: director.name,profilePath:director.profile_path } : null,
      cast: cast,
      platforms: platforms,
    };

    const createdMovie = await prisma.movie.create({
      data: newMovie,
    });

    return NextResponse.json(createdMovie);
  } catch (error) {
    console.error("Error al obtener los datos de la película desde TMDB", error);
    return NextResponse.json({ error: "Error al obtener la película" }, { status: 500 });
  }
}

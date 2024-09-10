
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
      posterPath : true,
      releaseDate: true,
      overview: true,
      runtime: true,
      voteAverage: true,
      productionCompanies: true,
      spokenLanguages: true,
      productionCountries: true,
      genres: true,
      director: true,
      cast: true,
      recommendations: true,
      platforms: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  // Si la película existe, verificar si han pasado más de 7 días
  if (movie) {
    const oneWeekAgo = subWeeks(new Date(), 1);

    // Si ha pasado más de una semana, actualizar los datos volátiles
    if (isAfter(oneWeekAgo, movie.updatedAt)) {
      // Hacer fetch a la API para obtener los datos volátiles actualizados
      const movieData = await fetchMovieFromTMDB(movieId);

      // Actualizar solo los campos volátiles
      movie = await prisma.movie.update({
        where: { id: movieId },
        data: {
          voteAverage: movieData.vote_average,
          recommendations: movieData.recommendations,
          platforms: movieData.platforms,
        },
      });
    }

    // Devolver la película de la base de datos (ya actualizada si es necesario)
    return NextResponse.json(movie);
  }

  // Si la película no existe, hacer fetch a la API y crearla en la base de datos
  try {
    const movieData = await fetchMovieFromTMDB(movieId);

    const {title,poster_path,release_date,overview,runtime,vote_average,production_companies,spoken_languages,production_countries,genres,director,cast,recommendations,platforms}=movieData

    const newMovie: Movie = {
      id: movieId,
      title: title,
      posterPath: poster_path,
      releaseDate: new Date(release_date),
      overview: overview,
      runtime: runtime,
      voteAverage: vote_average,
      productionCompanies: production_companies,
      spokenLanguages: spoken_languages,
      productionCountries: production_countries,
      genres: genres,
      director: director ? { name: director.name,profilePath:director.profile_path } : null,
      cast: cast,
      recommendations: recommendations,
      platforms: platforms,
    };

    // Guardar la nueva película en la base de datos
    const createdMovie = await prisma.movie.create({
      data: newMovie,
    });

    // Devolver la película recién creada
    return NextResponse.json(createdMovie);
  } catch (error) {
    console.error("Error al obtener los datos de la película desde TMDB", error);
    return NextResponse.json({ error: "Error al obtener la película" }, { status: 500 });
  }
}

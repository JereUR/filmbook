import { Movie } from "./types";

const API_KEY = process.env.MOVIE_API_KEY;
const ACCESS_TOKEN = process.env.MOVIE_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

interface CrewMember {
  name: string;
  job: string;
}

interface CastMember {
  name: string;
  character: string;
  profile_path: string;
}

export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    const response = await fetch(`/api/tmdb/movie?id=${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener los datos de la película');
    }
    const data: Movie = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export async function fetchMovieFromTMDB(movieId: string) {
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  };

  // Fetch de los detalles de la película
  const movieResponse = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`,
    {
      headers,
    }
  );

  if (!movieResponse.ok) {
    throw new Error("Error al obtener los detalles de la película");
  }

  const movieData = await movieResponse.json();

  // Fetch del cast y crew (director y elenco)
  const creditsResponse = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=es-ES`,
    {
      headers,
    }
  );

  if (!creditsResponse.ok) {
    throw new Error("Error al obtener el cast y crew de la película");
  }

  const creditsData = await creditsResponse.json();

  // Obtener el director (de los miembros del equipo de producción)
  const director = creditsData.crew?.find(
    (member: CrewMember) => member.job === "Director"
  );
  
  // Obtener el elenco principal (máximo 5 actores)
  const cast = creditsData.cast.slice(0, 5).map((actor: CastMember) => ({
    name: actor.name,
    character: actor.character,
    profile_path: actor.profile_path,
  }));

  // Fetch de las recomendaciones
  /* const recommendationsResponse = await fetch(
    `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=es-ES`,
    {
      headers,
    }
  );

  if (!recommendationsResponse.ok) {
    throw new Error("Error al obtener las recomendaciones de la película");
  }

  const recommendationsData = await recommendationsResponse.json(); */

  // Fetch de las plataformas de streaming en Argentina
  const watchProvidersResponse = await fetch(
    `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`,
    {
      headers,
    }
  );

  if (!watchProvidersResponse.ok) {
    throw new Error("Error al obtener las plataformas de streaming");
  }

  const watchProvidersData = await watchProvidersResponse.json();
  const platforms =
    watchProvidersData.results?.AR?.flatrate?.map((provider: any) => provider.provider_name) || [];

  // Devolver todos los datos estructurados
  return {
    title: movieData.title,
    poster_path: movieData.poster_path,
    release_date: movieData.release_date,
    overview: movieData.overview,
    runtime: movieData.runtime,
    vote_average: movieData.vote_average,
    production_companies: movieData.production_companies,
    spoken_languages: movieData.spoken_languages,
    production_countries: movieData.production_countries,
    genres: movieData.genres,
    director: director,
    cast: cast,
    recommendations: undefined,
    platforms: platforms,
  };
}

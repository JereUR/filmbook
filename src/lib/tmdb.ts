import { translateJobToSpanish } from "./translations";
import { Movie, Recommendation } from "./types";

const API_KEY = process.env.MOVIE_API_KEY;
const ACCESS_TOKEN = process.env.MOVIE_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";
const BASE_IMG_TMDB = "https://image.tmdb.org/t/p/original";

interface CastMember {
  name: string;
  character: string;
  profile_path: string;
}

interface CrewMember {
  id: number;
  job: string;
  name: string;
  profile_path: string | null;
}

type JobType =
  | "Director"
  | "Producer"
  | "Writer"
  | "Co-Producer"
  | "Director of Photography"
  | "Original Music Composer"
  | "Visual Effects Producer";

const desiredJobsOrder: Record<JobType, number> = {
  Director: 1,
  Producer: 2,
  Writer: 3,
  "Co-Producer": 4,
  "Director of Photography": 5,
  "Original Music Composer": 6,
  "Visual Effects Producer": 7,
};

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json;charset=utf-8",
};

export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    const response = await fetch(`/api/tmdb/movie?id=${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos de la película");
    }
    const data: Movie = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRecomendationsMovieById(
  id: string,
): Promise<Recommendation[] | null> {
  try {
    const response = await fetch(`/api/tmdb/recommendations?id=${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener las recomendaciones de la película");
    }
    const data: Recommendation[] = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const formatProviders = (results: any) => {
  const formattedResults: { [key: string]: any } = {};

  Object.keys(results).forEach((countryCode) => {
    const countryData = results[countryCode];

    formattedResults[countryCode] = {
      flatrate: countryData.flatrate
        ? countryData.flatrate.map((provider: any) => ({
            logo_path: `${BASE_IMG_TMDB}${provider.logo_path}`,
            provider_name: provider.provider_name,
            display_priority: provider.display_priority,
          }))
        : [],
      rent: countryData.rent
        ? countryData.rent.map((provider: any) => ({
            logo_path: `${BASE_IMG_TMDB}${provider.logo_path}`,
            provider_name: provider.provider_name,
            display_priority: provider.display_priority,
          }))
        : [],
      buy: countryData.buy
        ? countryData.buy.map((provider: any) => ({
            logo_path: `${BASE_IMG_TMDB}${provider.logo_path}`,
            provider_name: provider.provider_name,
            display_priority: provider.display_priority,
          }))
        : [],
    };
  });

  return formattedResults;
};

const filterCrew = (crew: any[]) => {
  const desiredJobs = Object.keys(desiredJobsOrder) as JobType[];
  return crew.filter((member) => desiredJobs.includes(member.job as JobType));
};

export async function fetchMovieFromTMDB(movieId: string) {
  // Fetch de los detalles de la película
  const movieResponse = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`,
    {
      headers,
    },
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
    },
  );

  if (!creditsResponse.ok) {
    throw new Error("Error al obtener el cast y crew de la película");
  }

  const creditsData = await creditsResponse.json();

  // Obtener el director (de los miembros del equipo de producción)
  const directors = creditsData.crew?.filter(
    (member: CrewMember) => member.job === "Director",
  );

  const filteredCrew = filterCrew(creditsData.crew);

  // Ordena los miembros de la crew
  const sortedCrew = filteredCrew.sort((a: CrewMember, b: CrewMember) => {
    return (
      (desiredJobsOrder[a.job as JobType] || Infinity) -
      (desiredJobsOrder[b.job as JobType] || Infinity)
    );
  });

  const crew = sortedCrew.map((member: CrewMember) => ({
    id: member.id,
    name: member.name,
    job: translateJobToSpanish(member.job),
    profilePath: member.profile_path
      ? `${BASE_IMG_TMDB}${member.profile_path}`
      : null,
  }));

  // Obtener el elenco principal (máximo 5 actores)
  const cast = creditsData.cast.slice(0, 10).map((actor: CastMember) => ({
    name: actor.name,
    character: actor.character,
    profilePath: actor.profile_path
      ? `${BASE_IMG_TMDB}${actor.profile_path}`
      : null,
  }));

  // Fetch de las plataformas de streaming en Argentina
  const watchProvidersResponse = await fetch(
    `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`,
    {
      headers,
    },
  );

  if (!watchProvidersResponse.ok) {
    throw new Error("Error al obtener las plataformas de streaming");
  }

  const watchProvidersData = await watchProvidersResponse.json();
  const providers = formatProviders(watchProvidersData.results);

  return {
    title: movieData.title,
    backdrop_path: movieData.backdrop_path
      ? `${BASE_IMG_TMDB}${movieData.backdrop_path}`
      : undefined,
    poster_path: movieData.poster_path
      ? `${BASE_IMG_TMDB}${movieData.poster_path}`
      : undefined,
    release_date: movieData.release_date,
    overview: movieData.overview,
    runtime: movieData.runtime,
    vote_average: movieData.vote_average,
    vote_count: movieData.vote_count,
    production_companies: movieData.production_companies.map((prod: any) => ({
      ...prod,
      logo_path: prod.logo_path ? `${BASE_IMG_TMDB}${prod.logo_path}` : null,
    })),
    spoken_languages: movieData.spoken_languages,
    production_countries: movieData.production_countries,
    genres: movieData.genres,
    directors,
    crew,
    cast,
    providers,
  };
}

export async function fetchMovieRecommendations(movieId: string) {
  try {
    const recommendationsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=es-ES`,
      {
        headers,
      },
    );

    if (!recommendationsResponse.ok) {
      throw new Error("Error al obtener las recomendaciones de la película");
    }

    const recommendationsData = await recommendationsResponse.json();

    const recommendations = recommendationsData.results
      .slice(0, 8)
      .map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
          ? `${BASE_IMG_TMDB}${movie.poster_path}`
          : undefined,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      }));

    return { results: recommendations };
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener recomendaciones de la película");
  }
}

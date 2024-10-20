import { Prisma } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { StaticImageData } from "next/image";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: { content: true },
  },
  review: {
    select: {
      review: true,
      movie: {
        select: {
          title: true,
          id: true,
        },
      },
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}

export interface SearchMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path?: string;
  genre_names: string[];
}

export interface SearchMoviesResponse {
  movies: SearchMovie[];
  nextPage: number | null;
  error?: string;
}

export interface TMDBSearchResponse {
  results: SearchMovie[];
}

export interface Movie {
  id: string;
  title: string;
  backdropPath?: string;
  posterPath?: string;
  releaseDate?: Date;
  overview: string;
  runtime: number;
  voteAverage?: number;
  voteCount?: number;
  productionCompanies?: any;
  spokenLanguages?: any;
  productionCountries?: any;
  genres?: any;
  directors?: any;
  crew?: any;
  cast?: any;
  recommendations?: any;
  providers?: any;
  rating?: any;
  reviews?: any;
  watchlist?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TMDBResponse {
  page: number;
  total_results: number;
  total_pages: number;
  results: Array<{
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
    genre_ids: number[];
  }>;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CrewMember {
  id?: number;
  job: string;
  name: string;
  profilePath: string | null;
}

export interface CreditsData {
  crew: CrewMember[];
}

export interface Recommendation {
  id: string;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface RecommendationsResponse {
  results: Recommendation[];
}

export interface CastMember {
  id?: number;
  name: string;
  character?: string;
  profilePath: string;
}

export interface ImageInfo {
  src: string | StaticImageData;
  name: string;
}

export interface ReviewInfo {
  id: string;
  userId?: string;
  movieId?: string;
  movie: {
    id?: string;
    title?: string;
    backdropPath?: string | null;
    posterPath?: string | null;
    releaseDate?: Date | null;
    directors?: any;
    overview?: string | null;
    runtime?: number | null;
    voteAverage?: number | null;
    updatedAt?: Date;
  };
  user?: {
    username: string;
    avatarUrl?: string | null;
    displayName?: string;
  };
  rating: number | null;
  review?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  liked: boolean;
  watched?: boolean;
  likesData?: LikeInfo;
}

export interface ReviewResumeInfo {
  id: string;
  userId?: string;
  movieId?: string;
  movie?: {
    title?: string;
    releaseDate?: string;
  };
  user?: {
    username: string;
    avatarUrl?: string | null;
  };
  rating: number | null;
  liked: boolean;
  review?: string | null;
  createdAt: Date;
}

export interface ReviewResumeInfoPage {
  reviews: ReviewResumeInfo[];
  nextCursor: string | null;
}

export interface ReviewSinglePage {
  reviews: ReviewInfo[];
}

export interface ReviewsPage {
  reviews: ReviewInfo[];
  nextCursor: string | null;
}

export interface WatchlistInfo {
  isAddToWatchlistByUser: boolean;
}

export interface WatchedInfo {
  isWatchedByUser: boolean;
}

export interface LikedInfo {
  isLikedByUser: boolean;
}

export interface ReviewData {
  id: string;
  rating: number | null;
  review: string | null;
  liked: boolean;
  watched: boolean;
}

export interface WatchlistData {
  id: string;
  movieId: string;
  movie: {
    id: string;
    title: string;
    runtime: number | null;
    overview: string | null;
    genres: any;
    directors: any;
    posterPath: string | null;
    releaseDate: Date | null;
    voteAverage: number | null;
    providers: any;
  };
  voteApp: number | null;
}

export interface WatchlistPage {
  watchlist: WatchlistData[];
  nextCursor: string | null;
}

export interface DiaryInfo {
  id: string;
  userId: string;
  movieId: string;
  movie: {
    id: string;
    title: string;
    posterPath: string | null;
    releaseDate: Date | null;
  };
  reviewId: string | null;
  review: {
    liked: boolean;
    reviewText: string | null;
    rating: number | null;
  };
  watchedOn: Date;
}

export interface DiariesPage {
  diaries: DiaryInfo[];
  nextCursor: string | null;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  participants: ParticipantTournament[];
  dates: TournamentDate[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ParticipantTournament {
  participantId: string;
  participantName: string;
  participantUsername: string;
  tournaments: TournamentPosition[];
}

export interface TournamentPosition {
  tournamentId: string;
  tournamentName: string;
  totalPoints: number;
  position: number;
}

export interface TournamentDate {
  id: string;
  date: number;
  movie: {
    id: string;
    title: string;
  };
  scores: ParticipantScore[];
}

export interface ParticipantScore {
  participantId: string;
  participantName: string;
  points: number;
  extraPoints: number;
}

export interface TournamentData {
  id: string;
  name: string;
  description?: string | null;
  participants: number;
  dates: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentsPage {
  tournaments: TournamentData[];
  nextCursor: string | null;
}

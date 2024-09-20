import { Prisma } from "@prisma/client";

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

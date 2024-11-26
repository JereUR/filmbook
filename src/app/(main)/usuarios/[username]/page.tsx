import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Metadata } from "next"

import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types"
import { validateRequest } from "@/auth"
import TrendsSidebar from "@/components/TrendsSidebar"
import UserAvatar from "@/components/UserAvatar"
import { dateFormat, formatNumber } from "@/lib/utils"
import FollowerCount from "@/components/FollowerCount"
import FollowButton from "@/components/FollowButton"
import UserPosts from "./UserPosts"
import Linkify from "@/components/Linkify"
import EditProfileButton from "./EditProfileButton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserReviewsList from "@/components/user/lists/review/UserReviewsList"
import UserDiariesList from "@/components/user/lists/diary/UserDiariesList"
import UnauthorizedMessage from "@/components/UnauthorizedMessage"
import FavoriteMovies from "@/components/user/lists/favoriteMovies/FavoriteMovies"

interface UserPageProps {
  params: { username: string }
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  })

  if (!user) notFound()

  return user
})

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) return {}

  const user = await getUser(username, loggedInUser.id)

  return {
    title: `${user.displayName} (@${user.username})`,
  }
}

export default async function UserPage({
  params: { username },
}: UserPageProps) {
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return (
      <UnauthorizedMessage sectionMessage='Necesitas iniciar sesión para ver perfiles de usuarios.' trendsSidebar={true} />
    )
  }

  const user = await getUser(username, loggedInUser.id)

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <Tabs defaultValue="posts" className='w-full'>
          <TabsList className="rounded-md bg-card-child p-1 text-muted-foreground shadow-sm">
            <TabsTrigger value="posts" className="text-xs sm:text-sm">Publicaciones</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
            <TabsTrigger value="diary" className="text-xs sm:text-sm">Bitácora</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <UserPosts userId={user.id} />
          </TabsContent>
          <TabsContent value="reviews">
            <UserReviewsList userId={user.id} username={username} />
          </TabsContent>
          <TabsContent value="diary">
            <UserDiariesList userId={user.id} />
          </TabsContent>
        </Tabs>

      </div>
      <TrendsSidebar />
    </main>
  )
}

interface UserProfileProps {
  user: UserData
  loggedInUserId: string
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  }

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div className='text-foreground/40'>Miembro desde el {dateFormat(user.createdAt.toISOString())}</div>
          <div className="flex items-center gap-3">
            <span className='py-2 px-4 bg-card/40 border rounded-2xl border-primary/70'>
              Posts: {""}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <div>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words text-muted-foreground my-4">
              {user.bio}
            </div>
          </Linkify>
          <hr />
        </div>
      )}
      <FavoriteMovies initialData={user.favoriteMovies} username={user.username} />
    </div>
  )
}

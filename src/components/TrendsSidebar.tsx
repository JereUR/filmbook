import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import Image from "next/image"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import UserAvatar from "./UserAvatar"
import { formatNumber } from "@/lib/utils"
import FollowButton from "./FollowButton"
import { getUserDataSelect } from "@/lib/types"
import UserTooltip from "./UserTooltip"
import oscarsImg from '@/assets/Oscars2025.jpg'

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[8.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <div className="relative h-40 w-full group overflow-hidden rounded-2xl border-2 border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link
            href="/nominaciones-oscars"
            aria-label="Ir a sección de Golden Globe"
            className="block h-full w-full"
          >
            <Image
              src={oscarsImg}
              alt="Oscars 97th Academy Awards"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xl font-bold">Oscars 97th Academy Awards</span>
            </div>
          </Link>
        </div>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  )
}

async function WhoToFollow() {
  const { user } = await validateRequest()

  if (!user) return null

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: { id: user.id },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  })

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">A quien seguir</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/usuarios/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  )
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+','g'))) AS hashtag, COUNT(*) AS count
    FROM posts
    GROUP BY (hashtag)
    ORDER BY count DESC, hashtag ASC
    LIMIT 10
  `

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }))
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
)

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics()

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">De qué se está hablando</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1]
        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

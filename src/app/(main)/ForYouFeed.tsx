"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import Post from "@/components/posts/Post"
import PostsLoadingSkeleton from "@/components/skeletons/PostsLoadingSkeleton"
import kyInstance from "@/lib/ky"
import { PostsPage } from "@/lib/types"

export default function ForYouFeed() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: async ({ pageParam }) => {
      return await kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<PostsPage>()
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const posts = data?.pages.flatMap((page) => page.posts) || []
  const errorMessage = (error as any)?.response?.status === 401 ? "Debes iniciar sesión para visualizar posts." : "Error inesperado al cargar las publicaciones."

  if (status === "pending") {
    return <PostsLoadingSkeleton />
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Todavía nadie a posteado nada.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">{errorMessage}</p>
    )
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}

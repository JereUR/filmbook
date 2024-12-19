import Link from "next/link"
import Image from "next/image"

import PostEditor from "@/components/posts/editor/PostEditor"
import TrendsSidebar from "@/components/TrendsSidebar"
import ForYouFeed from "./ForYouFeed"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import FollowingFeed from "./FollowingFeed"
import AddToDiaryButton from './AddToDiaryButton'
import { validateRequest } from "@/auth"
import UnauthorizedMessage from "@/components/UnauthorizedMessage"
import goldenGlobeImg from "@/assets/golden-globe-banner.webp"

export default async function Home() {
  const { user: loggedInUser } = await validateRequest()

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2 md:space-y-5">
        <div className="relative h-40 w-full group overflow-hidden rounded-2xl border-2 border-primary shadow-md md:hidden hover:shadow-lg transition-shadow duration-300">
          <Link
            href="/nominaciones-golden-globe"
            aria-label="Ir a sección de Golden Globe"
            className="block h-full w-full"
          >
            <Image
              src={goldenGlobeImg}
              alt="Golden Globe Awards"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xl font-bold">Golden Globe Awards 2025</span>
            </div>
          </Link>
        </div>
        {loggedInUser ? <div>
          <PostEditor className="rounded-t-2xl border-b-0" />
          <AddToDiaryButton />
        </div> :
          <UnauthorizedMessage sectionMessage='Necesitas iniciar sesión para realizar posteos y agregar nuevas películas vistas.' trendsSidebar={false} />}
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">Para ti</TabsTrigger>
            {loggedInUser && <TabsTrigger value="following">Seguidos</TabsTrigger>}
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          {loggedInUser && <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>}
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  )
}

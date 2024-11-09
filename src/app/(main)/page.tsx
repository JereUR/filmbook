import PostEditor from "@/components/posts/editor/PostEditor"
import TrendsSidebar from "@/components/TrendsSidebar"
import ForYouFeed from "./ForYouFeed"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import FollowingFeed from "./FollowingFeed"
import AddToDiaryButton from './AddToDiaryButton'
import { validateRequest } from "@/auth"
import UnauthorizedMessage from "@/components/UnauthorizedMessage"

export default async function Home() {
  const { user: loggedInUser } = await validateRequest()

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {loggedInUser ? <div>
          <PostEditor className="rounded-t-2xl border-b-0" />
          <AddToDiaryButton />
        </div> : <UnauthorizedMessage sectionMessage='Necesitas iniciar sesión para realizar posteos y agregar nuevas películas vistas.' trendsSidebar={false} />}
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

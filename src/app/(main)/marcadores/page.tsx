import { Metadata } from "next";

import Bookmarks from "./Bookmarks";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validateRequest } from "@/auth";
import Watchlist from "./Watchlist";

export const metadata: Metadata = {
  title: "Marcadores",
};

export default async function BookmarksPage() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">No estas autorizado a ver esta página.</p>
    );
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Tabs defaultValue="bookmarks" className='w-full'>
          <TabsList className="rounded-md bg-card-child p-1 text-muted-foreground shadow-sm">
            <TabsTrigger value="bookmarks" className="text-xs sm:text-sm">Marcadores</TabsTrigger>
            <TabsTrigger value="watchlist" className="text-xs sm:text-sm">Watchlist</TabsTrigger>
          </TabsList>
          <TabsContent value="bookmarks">
            <Bookmarks />
          </TabsContent>
          <TabsContent value="watchlist">
            <Watchlist userId={loggedInUser.id} />
          </TabsContent>
        </Tabs>

      </div>
      <TrendsSidebar />
    </main>
  );
}

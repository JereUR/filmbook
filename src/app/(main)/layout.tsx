import { validateRequest } from "@/auth"
import SessionProvider from "./SessionProvider"
import Navbar from "./Navbar"
import MenuBar from "./MenuBar"
import ConditionalPopularMovies from './ConditionalPopularMovies'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, session } = await validateRequest()

  return (
    <SessionProvider value={{ user, session }}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-[1500px] grow md:gap-5 p-2 md:p-5">
          <div className="sticky top-[8.25rem] flex flex-col gap-5">
            <MenuBar className="hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80 z-50" />
            <ConditionalPopularMovies />
          </div>
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-around border-t bg-card py-3 sm:hidden z-50" />
      </div>
    </SessionProvider>
  )
}


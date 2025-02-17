import { Bookmark, CircleHelp, Home, Popcorn, Trophy } from "lucide-react"
import Link from "next/link"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import NotificationsButton from "./NotificationsButton"
import MessagesButton from "./MessagesButton"
import streamServerClient from "@/lib/stream"

interface MenuBarProps {
  className?: string
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  const defaultClassName = "flex items-center justify-start gap-3 text-sm sm:text-base"

  if (!user)
    return (
      <div className={className}>
        <Button
          variant="ghost"
          className={defaultClassName}
          title="Inicio"
          asChild
        >
          <Link href="/">
            <Home />
            <span className="hidden lg:inline">Inicio</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={defaultClassName}
          title="Explorar películas"
          asChild
        >
          <Link href="/explorar-peliculas">
            <Popcorn />
            <span className="hidden lg:inline">Explorar películas</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={defaultClassName}
          title="Explorar películas"
          asChild
        >
          <Link href="/torneos">
            <Trophy />{" "}
            <span className="hidden lg:inline">Torneos</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={defaultClassName}
          title="Información de Filmbook"
          asChild
        >
          <Link href="/informacion">
            <CircleHelp /> <span className="hidden lg:inline">Información de Filmbook</span>
          </Link>
        </Button>
      </div>
    );

  const [unreadNotificationCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className={defaultClassName}
        title="Inicio"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Inicio</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className={defaultClassName}
        title="Explorar películas"
        asChild
      >
        <Link href="/explorar-peliculas">
          <Popcorn />
          <span className="hidden lg:inline">Explorar películas</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className={defaultClassName}
        title="Explorar películas"
        asChild
      >
        <Link href="/torneos">
          <Trophy />{" "}
          <span className="hidden lg:inline">Torneos</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <Button
        variant="ghost"
        className={defaultClassName}
        title="Marcadores"
        asChild
      >
        <Link href="/marcadores">
          <Bookmark /> <span className="hidden lg:inline">Marcadores</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className={defaultClassName}
        title="Información de Filmbook"
        asChild
      >
        <Link href="/informacion">
          <CircleHelp /> <span className="hidden lg:inline">Información de Filmbook</span>
        </Link>
      </Button>
    </div>
  );
}

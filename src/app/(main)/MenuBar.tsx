import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Bell, Bookmark, Home, Mail, Popcorn } from "lucide-react";
import Link from "next/link";
import React from "react";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadNotificationCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Inicio"
        asChild
      >
        <Link href="/">
          <Home /> <span className="hidden lg:inline">Inicio</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Explorar películas"
        asChild
      >
        <Link href="/explorar-peliculas">
          <Popcorn />{" "}
          <span className="hidden lg:inline">Explorar películas</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Mensajes"
        asChild
      >
        <Link href="/mensajes">
          <Mail /> <span className="hidden lg:inline">Mensajes</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Marcadores"
        asChild
      >
        <Link href="/marcadores">
          <Bookmark /> <span className="hidden lg:inline">Marcadores</span>
        </Link>
      </Button>
    </div>
  );
}

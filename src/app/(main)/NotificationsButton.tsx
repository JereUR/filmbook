'use client'

import { Bell } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { NotificationCountInfo } from "@/lib/types"
import kyInstance from "@/lib/ky"

interface NotificationsButtonProps {
  initialState: NotificationCountInfo
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  })

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3 text-sm sm:text-base"
      title="Notificaciones"
      asChild
    >
      <Link href="/notificaciones">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>{" "}
        <span className="hidden lg:inline">Notificaciones</span>
      </Link>
    </Button>
  )
}

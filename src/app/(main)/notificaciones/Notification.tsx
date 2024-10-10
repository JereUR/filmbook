import { Heart, MessageCircle, Popcorn, User2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { NotificationType } from "@prisma/client";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} te ha seguido.`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/usuarios/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} ha comentado tu publicación.`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: notification.review
        ? `${notification.issuer.displayName} ha dado like a tu review.`
        : `${notification.issuer.displayName} ha dado like a tu publicación.`,
      icon: <Heart className="size-7 fill-red-600 text-red-600" />,
      href: notification.review
        ? `/reviews/${notification.reviewId}`
        : `/posts/${notification.postId}`,
    },
    REVIEW: {
      message: `${notification.issuer.displayName} ha publicado una nueva review de "${notification.review?.movie?.title}".`,
      icon: <Popcorn className="size-7 fill-primary text-primary" />,
      href: notification.reviewId
        ? `/pelicula/review/${notification.reviewId}?title=${encodeURIComponent(notification.review ? notification.review?.movie?.title : '')}&date=${new Date(notification.createdAt).getFullYear()}&username=${notification.issuer.username}&movieId=${notification.review?.movie?.id}`
        : '/',
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

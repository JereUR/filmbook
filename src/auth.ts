import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { Lucia, Session, User } from "lucia"
import { cache } from "react"
import { cookies } from "next/headers"
import { Google } from "arctic"

import prisma from "./lib/prisma"

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      email: databaseUserAttributes.email,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
      admin: databaseUserAttributes.admin,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  id: string
  username: string
  email: string | null
  displayName: string
  avatarUrl: string | null
  googleId: string | null
  admin: boolean
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
)

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null

    if (!sessionId) {
      return { user: null, session: null }
    }

    const result = await lucia.validateSession(sessionId)

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        cookieStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookieStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }
    } catch (error) {}

    return result
  },
)

export const validateAdmin = cache(
  async (): Promise<{ user: User | null; admin: boolean }> => {
    const { user: loggedInUser } = await validateRequest()

    const user = await prisma.user.findFirst({
      where: {
        id: loggedInUser?.id,
      },
      select: {
        admin: true,
      },
    })

    if (!loggedInUser || !user) {
      return { user: null, admin: false }
    }

    return { user: loggedInUser, admin: user.admin }
  },
)

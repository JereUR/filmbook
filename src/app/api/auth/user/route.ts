import { validateRequest } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const { user } = await validateRequest()

  if (user) {
    const safeUser = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
    }

    return NextResponse.json(safeUser)
  } else {
    return NextResponse.json(null)
  }
}

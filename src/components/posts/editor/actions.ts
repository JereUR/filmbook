"use server";

import { validateRequest } from "@/auth";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");
}

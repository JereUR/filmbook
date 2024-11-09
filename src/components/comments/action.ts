"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getCommentDataInclude, PostData } from "@/lib/types"
import { createCommentSchema } from "@/lib/validation"

export async function submitComment({
  post,
  content,
}: {
  post: PostData
  content: string
}) {
  const { user } = await validateRequest()

  if (!user) throw Error("No autorizado.")

  const { content: contentValidated } = createCommentSchema.parse({ content })

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        userId: user.id,
        postId: post.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.userId !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.userId,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ])

  return newComment
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest()

  if (!user) throw Error("No autorizado.")

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  })

  if (!comment) throw Error("Comentario no encontrado.")

  if (comment.userId !== user.id) throw Error("No autorizado.")

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  })

  return deletedComment
}

import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import DynamicAwardNominees from "@/components/awards/DynamicAwardNominees"
import { Metadata } from "next"

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const event = await prisma.awardEvent.findUnique({
        where: { id },
        select: { name: true }
    })

    return {
        title: event ? `Nominados - ${event.name}` : "Nominados"
    }
}

export default async function AwardNomineesPage({ params }: Props) {
    const { id } = await params
    const { user } = await validateRequest()

    const event = await prisma.awardEvent.findUnique({
        where: { id },
        include: {
            categories: {
                include: {
                    nominees: true
                },
                orderBy: {
                    name: "asc"
                }
            }
        }
    })

    if (!event) {
        return notFound()
    }

    let initialPredictions: any[] = []
    if (user) {
        initialPredictions = await prisma.prediction.findMany({
            where: {
                userId: user.id,
                awardEventId: id
            }
        })
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-6">
            <DynamicAwardNominees
                event={event}
                categories={event.categories}
                initialPredictions={initialPredictions}
            />
        </div>
    )
}

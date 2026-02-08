import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AwardCeremonyManagement from "@/components/awards/AwardCeremonyManagement";
import CategoryManagement from "@/components/awards/CategoryManagement";
import NomineeManagement from "@/components/awards/NomineeManagement";

export const metadata: Metadata = {
    title: "Gestión de Premios",
};

export default async function AdminPage() {
    const events = await prisma.awardEvent.findMany({
        orderBy: { createdAt: "desc" },
    });

    const categories = await prisma.category.findMany({
        include: { events: true, nominees: true },
        orderBy: { name: "asc" },
    });

    const nominees = await prisma.nominee.findMany({
        include: { category: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="w-full">
            <Tabs defaultValue="ceremonies" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="ceremonies">Entregas</TabsTrigger>
                    <TabsTrigger value="categories">Categorías</TabsTrigger>
                    <TabsTrigger value="nominees">Nominados</TabsTrigger>
                </TabsList>
                <TabsContent value="ceremonies" className="space-y-4">
                    <AwardCeremonyManagement initialData={events} />
                </TabsContent>
                <TabsContent value="categories" className="space-y-4">
                    <CategoryManagement initialData={categories} ceremonies={events} />
                </TabsContent>
                <TabsContent value="nominees" className="space-y-4">
                    <NomineeManagement initialData={nominees} categories={categories} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

import { validateAdmin } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, admin } = await validateAdmin();

    if (!user || !admin) {
        redirect("/");
    }

    return (
        <div className="w-full space-y-5">
            <div className="rounded-2xl bg-card p-5 shadow-sm">
                <h1 className="text-2xl font-bold">Gestión de Premios</h1>
            </div>
            {children}
        </div>
    );
}

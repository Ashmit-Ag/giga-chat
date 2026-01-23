import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {

    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const mods = await prisma.mod.findMany({
        orderBy: { email: "asc" }
    });

    return NextResponse.json(mods);
}

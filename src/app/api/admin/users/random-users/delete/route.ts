import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {

    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
            { error: "No user IDs provided" },
            { status: 400 }
        );
    }

    await prisma.user.deleteMany({
        where: {
            id: { in: ids },
        },
    });

    return NextResponse.json({ success: true });
}

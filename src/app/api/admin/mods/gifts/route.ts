import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {

  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const users = await prisma.mod.findMany({
      where: {
        totalGiftAmount: {
          gt: 0,
        },
      },
      orderBy: {
        totalGiftAmount: "desc",
      },
      select: {
        id: true,
        email: true,
        totalGiftAmount: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("TOP GIFTERS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch top gifters" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {

const session = await getServerSession(authOptions);

if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = 50;

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      totalGiftAmount: true,
      plan: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(users);
}



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
    const plans = await prisma.plan.findMany({
      include: {
        _count: { select: { users: true } }
      }
    });

    let totalMRR = 0;
    let basicUsers = 0;
    let premiumUsers = 0;

    for (const plan of plans) {
      totalMRR += plan.price * plan._count.users;

      if (plan.name === "basic") {
        basicUsers = plan._count.users;
      }

      if (plan.name === "premium") {
        premiumUsers = plan._count.users;
      }
    }

    const totalUsers = await prisma.user.count();

    const totalRevenueAgg = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS"}
    });

    return NextResponse.json({
      totalRevenue: totalRevenueAgg._sum.amount ?? 0,
      totalMRR,
      totalUsers,
      basicUsers,
      premiumUsers
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch admin analytics" },
      { status: 500 }
    );
  }
}

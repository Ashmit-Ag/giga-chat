import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  // 🔐 Protect cron
  if (
    req.headers.get('Authorization') !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1️⃣ Fetch all plans with their limits
  const plans = await prisma.plan.findMany({
    select: {
      id: true,
      maxDailyChats: true
    }
  })

  // 2️⃣ Update users per plan
  const updates = plans.map(plan =>
    prisma.user.updateMany({
      where: { planId: plan.id },
      data: {
        chatCount: plan.maxDailyChats
      }
    })
  )

  // 3️⃣ Run all updates
  await prisma.$transaction(updates)

  return Response.json({
    success: true,
    updatedPlans: plans.length
  })
}

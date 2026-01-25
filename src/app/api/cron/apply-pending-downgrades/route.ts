import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  if (
    req.headers.get('Authorization') !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    where: {
      pendingPlanId: { not: null },
      billingDate: { gt: new Date() }
    }
  })

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planId: user.pendingPlanId,
        pendingPlanId: null
      }
    })
  }

  return Response.json({ success: true })
}

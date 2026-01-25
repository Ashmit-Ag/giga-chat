import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  if (
    req.headers.get('Authorization') !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.user.updateMany({
    where: {
      billingDate: { lt: new Date() },
      autopayEnabled: false
    },
    data: {
      planId: process.env.BASIC_PLAN_ID!,
      billingDate: null,
      pendingPlanId: null
    }
  })

  return Response.json({ success: true })
}

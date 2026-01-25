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
      autopayEnabled: true,
      billingDate: {
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    },
    data: {
      planId: process.env.BASIC_PLAN_ID!,
      autopayEnabled: false,
      payuSubId: null
    }
  })

  return Response.json({ success: true })
}

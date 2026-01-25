import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const { planId } = await req.json()
  const session = await getServerSession(authOptions)

  if(!session?.user.id){
    return
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan) return Response.json({ error: 'Invalid plan' }, { status: 400 })

  const txnid = crypto.randomUUID()

  await prisma.payment.create({
    data: {
      txnid,
      userId: session.user.id,
      amount: plan.price,
      type: 'PLAN',
      refId: planId,
      status: 'PENDING'
    }
  })

  return Response.json({
    action: 'https://test.payu.in/_payment',
    payload: {
      key: process.env.PAYU_MERCHANT_KEY,
      txnid,
      amount: plan.price,
      productinfo: plan.name,
      firstname: session.user.firstName,
      phone: session.user.phone,

      // 🔥 Recurring params
      enable_payu_subs: 1,
      subscription_type: 'MONTHLY',
      billing_cycle: 1,
      billing_amount: plan.price,

      surl: `${process.env.BASE_URL}/api/payu/verify`,
      furl: `${process.env.BASE_URL}/api/payu/verify`
    }
  })
}

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST() {
  try {

    const session = await getServerSession(authOptions)
    if(!session?.user.id){
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
        where: {id : session.user.id}
    })

    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!user.payuSubId) {
      return Response.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // 1️⃣ Call PayU to cancel subscription
    const payuRes = await fetch(
      'https://api.payu.in/subscription/cancel',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PAYU_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription_id: user.payuSubId
        })
      }
    )

    const payuText = await payuRes.text()

    if (!payuRes.ok) {
      console.error('PayU cancel failed:', payuText)
      return Response.json(
        { error: 'Failed to cancel subscription' },
        { status: 502 }
      )
    }

    // 2️⃣ Update DB (DO NOT remove plan immediately)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        autopayEnabled: false,
        payuSubId: null,
        pendingPlanId: null
      }
    })

    return Response.json({
      success: true,
      message: 'Autopay cancelled. Your plan will remain active until the end of the billing cycle.'
    })
  } catch (err) {
    console.error('Cancel subscription error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

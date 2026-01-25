import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server';
// import { getSessionUser } from '@/lib/auth'

export async function POST(req: Request) {
const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.log("SESSION",session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { planId } = await req.json()

  if (!session.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      pendingPlanId: planId
    }
  })

  return Response.json({
    message: 'Downgrade scheduled for next billing cycle'
  })
}

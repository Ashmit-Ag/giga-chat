import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { msg } = await req.json()

    if (!msg.amount) {
        return Response.json({ message: "Invalid Amount" }, { status: 400 })
    }

    await prisma.mod.update({
        where: { id: session.user.id },
        data: {
            totalGiftAmount: { increment: Number(msg.amount) },
            giftsRecieved: { increment: 1 }
        }
    })

    return Response.json({ mesaage: "Increment" }, { status: 200 })

}
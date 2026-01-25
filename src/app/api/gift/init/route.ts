import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'

function generatePayUHash({
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  salt,
}: {
  key: string
  txnid: string
  amount: string // IMPORTANT: string, not number
  productinfo: string
  firstname: string
  email: string
  salt: string
}) {
  const hashString = [
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    '', // udf1
    '', // udf2
    '', // udf3
    '', // udf4
    '', // udf5
    '', // empty
    '', // empty
    '', // empty
    '', // empty
    '', // empty
    salt,
  ].join('|')

  return crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex')
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amount } = await req.json()

  if (!amount || amount < 10) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const txnid = crypto.randomUUID()
  const normalizedAmount = Number(amount).toFixed(2)

  const email =
    session.user.email ||
    `${session.user.phone}@yourapp.local`

  const hash = generatePayUHash({
    key: process.env.PAYU_MERCHANT_KEY!,
    txnid,
    amount: normalizedAmount,
    productinfo: 'Chat Gift',
    firstname: session.user.firstName || 'User',
    email,
    salt: process.env.PAYU_SALT!,
  })

  await prisma.payment.create({
    data: {
      txnid,
      userId: session.user.id,
      amount: Number(normalizedAmount),
      type: 'GIFT',
      refId: session.user.id,
      status: 'PENDING',
    },
  })

  return Response.json({
    action: 'https://test.payu.in/_payment',
    payload: {
      key: process.env.PAYU_MERCHANT_KEY,
      txnid,
      amount: normalizedAmount,
      productinfo: 'Chat Gift',
      firstname: session.user.firstName || 'User',
      email,
      phone: session.user.phone,
      surl: `${process.env.BASE_URL}/api/gift/verify`,
      furl: `${process.env.BASE_URL}/api/gift/verify`,
      hash,
    },
  })
}


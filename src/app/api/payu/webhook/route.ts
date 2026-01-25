// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyPayUPayment } from "@/lib/payu";

import { prisma } from "@/lib/prisma"

// export async function POST(req: Request) {
//   const form = await req.formData();

//   const txnid = form.get("txnid") as string;
//   const amount = Number(form.get("amount"));

//   if (!txnid || !amount) {
//     return NextResponse.json({ ok: false }, { status: 400 });
//   }

//   const payment = await prisma.payment.findUnique({ where: { txnid } });
//   if (!payment) return NextResponse.json({ ok: false });

//   // ✅ Idempotency
//   if (payment.status === "SUCCESS") {
//     return NextResponse.json({ ok: true });
//   }

//   // 🔐 Verify with PayU
//   const verified = await verifyPayUPayment(txnid);
//   if (!verified) {
//     await prisma.payment.update({
//       where: { txnid },
//       data: { status: "FAILED" },
//     });
//     return NextResponse.json({ ok: false });
//   }

//   // 🧠 APPLY PLAN
//   const plan = await prisma.plan.findUnique({
//     where: { id: payment.refId },
//   });

//   if (!plan) return NextResponse.json({ ok: false });

//   const now = new Date();
//   const billingEnd = new Date(
//     now.getTime() + 30 * 24 * 60 * 60 * 1000
//   );

//   await prisma.user.update({
//     where: { id: payment.userId },
//     data: {
//       planId: plan.id,
//       billingDate: now,
//     },
//   });

//   await prisma.payment.update({
//     where: { txnid },
//     data: { status: "SUCCESS" },
//   });

//   return NextResponse.json({ ok: true });
// }


export async function POST(req: Request) {
  const body = await req.json()

  const {
    subscription_id,
    txnid,
    status,
    amount
  } = body

  const user = await prisma.user.findFirst({
    where: { payuSubId: subscription_id }
  })

  if (!user) return Response.json({ ok: true })

  if (status === 'success') {
    const nextBilling = new Date()
    nextBilling.setMonth(nextBilling.getMonth() + 1)

    const finalPlanId = user.pendingPlanId ?? user.planId

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          txnid,
          userId: user.id,
          amount,
          type: 'RENEWAL',
          refId: finalPlanId!,
          status: 'SUCCESS'
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          planId: finalPlanId,
          pendingPlanId: null,
          billingDate: nextBilling
        }
      })
    ])
  }

  return Response.json({ ok: true })
}

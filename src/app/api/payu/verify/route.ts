// app/api/payu/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayUPayment } from "@/lib/payu";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const txnid = searchParams.get("txnid");

  if (!txnid) {
    return NextResponse.json({ error: "Missing txnid" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { txnid } });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  // Idempotency
  if (payment.status === "SUCCESS") {
    return NextResponse.json({ status: "SUCCESS" });
  }

  const isPaid = await verifyPayUPayment(txnid);

  if (!isPaid) {
    await prisma.payment.update({
      where: { txnid },
      data: { status: "FAILED" },
    });

    return NextResponse.json({ status: "FAILED" });
  }

  // ✅ Mark payment success
  await prisma.$transaction([
    prisma.payment.update({
      where: { txnid },
      data: { status: "SUCCESS" },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: {
        planId: payment.refId, // plan id
      },
    }),
  ]);

  return NextResponse.json({ status: "SUCCESS" });
}

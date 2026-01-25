import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
// import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const data = await req.json();

  const {
    status,
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    hash,
  } = data;

  const salt = process.env.PAYU_SALT!;
  // const hashString = `${SALT}|${status}|||||||||${receiverSessionId}|${senderSessionId}|gift|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
  const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  if (hash !== calculatedHash) {
    return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
  }

  // Sender update
  // await prisma.user.update({
  //   where: { id: senderSessionId },
  //   data: {
  //     giftsSent: { push: Number(amount) },
  //     totalGiftAmount: { increment: Number(amount) },
  //   },
  // });

  // Receiver (mod) update
//   await prisma.moderator.update({
//     where: { sessionId: receiverSessionId },
//     data: {
//       totalGiftAmount: { increment: Number(amount) },
//     },
//   });

  return NextResponse.json({ success: true });
}

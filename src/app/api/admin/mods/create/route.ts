import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { count, domain } = await req.json();

  if (count > 50) {
    return NextResponse.json(
      { error: "Max 50 mods per request" },
      { status: 400 }
    );
  }
  
  if (!count || !domain) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // 1️⃣ Fetch existing mod emails for this domain
  const existingMods = await prisma.mod.findMany({
    where: {
      email: {
        endsWith: `@${domain}`
      }
    },
    select: { email: true }
  });

  const existingEmails = new Set(existingMods.map(m => m.email));

  const mods: { id: string; email: string; password: string }[] = [];

  let index = 1;

  // 2️⃣ Keep creating until we reach the requested count
  while (mods.length < count) {
    const email = `mod${index}@${domain}`;
    index++;

    // Skip if already exists
    if (existingEmails.has(email)) {
      continue;
    }

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const mod = await prisma.mod.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    existingEmails.add(email); // prevent duplicates in same request

    mods.push({
      id: mod.id,
      email,
      password: plainPassword
    });
  }

  return NextResponse.json({ mods });
}

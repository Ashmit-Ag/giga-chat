import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { updates } = await req.json();
  // updates: [{ id, email?, password? }]

  await Promise.all(
    updates.map(async (mod: any) => {
      const data: any = {};

      if (mod.email) {
        data.email = mod.email;
      }

      if (mod.password) {
        // 🔐 Hash password before storing
        data.password = await bcrypt.hash(mod.password, 12);
      }

      // Do not update if nothing changed
      if (!Object.keys(data).length) return;

      return prisma.mod.update({
        where: { id: mod.id },
        data
      });
    })
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { ids } = await req.json();

  if (!Array.isArray(ids) || !ids.length) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.mod.deleteMany({
    where: { id: { in: ids } }
  });

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  try {
    // 🔐 Get session (App Router compatible)
    const session = await getServerSession(authOptions);

    // 🛑 Authorization check
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // 📄 Pagination
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = 50;

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        pfpUrl: true,
        age: true,
        gender: true,
        city: true,
        totalGiftAmount: true,
        totalImageAmount: true,
        createdAt: true,
        phone: true,
        plan:{select: {name:true}}
      },
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("❌ ADMIN USERS API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request) {
    try {
      // 🔐 Session check
      const session = await getServerSession(authOptions);
  
      if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
  
      const body = await req.json();
      const { userId, password } = body;
  
      if (!userId || !password) {
        return NextResponse.json(
          { error: "Missing userId or password" },
          { status: 400 }
        );
      }
  
      // 🔒 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 🔄 Update user
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
  
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    } catch (error) {
      console.error("❌ RESET PASSWORD ERROR:", error);
  
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
  
    if (!session?.user?.id) {
      console.log("SESSION",session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    if (session?.user?.role !== "USER"){
      return NextResponse.json({message:"User only"}, {status:200});
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
  
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      
  
      return NextResponse.json({
        success: true,
        data:user
      });
  
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  
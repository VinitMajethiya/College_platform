import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: { collegeId: string } }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ data: null, error: { message: "Authentication required" } }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) {
    return NextResponse.json({ data: null, error: { message: "User not found" } }, { status: 404 });
  }

  await prisma.savedCollege.deleteMany({
    where: {
      userId: user.id,
      collegeId: params.collegeId
    }
  });

  return NextResponse.json({ data: { collegeId: params.collegeId }, error: null });
}

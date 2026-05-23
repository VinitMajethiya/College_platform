import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assignCollectionSchema } from "@/lib/validations/saved";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

  // Ensure collection exists and belongs to the user
  const collection = await prisma.collection.findUnique({
    where: { id: params.id }
  });
  if (!collection || collection.userId !== user.id) {
    return NextResponse.json({ data: null, error: { message: "Collection not found or access denied" } }, { status: 404 });
  }

  const body = await request.json();
  const parsed = assignCollectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: { message: "Invalid college id" } }, { status: 400 });
  }

  // Update or create saved college association with collectionId
  const savedCollege = await prisma.savedCollege.upsert({
    where: {
      userId_collegeId: {
        userId: user.id,
        collegeId: parsed.data.collegeId
      }
    },
    update: {
      collectionId: params.id
    },
    create: {
      userId: user.id,
      collegeId: parsed.data.collegeId,
      collectionId: params.id
    }
  });

  return NextResponse.json({
    data: {
      collectionId: savedCollege.collectionId,
      collegeId: savedCollege.collegeId
    },
    error: null
  });
}

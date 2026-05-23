import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { collectionSchema } from "@/lib/validations/saved";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { data: null, error: { message: "Authentication required" } },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "User not found" } },
      { status: 404 }
    );
  }

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: {
      colleges: {
        select: { collegeId: true }
      }
    }
  });

  return NextResponse.json({ data: collections, error: null });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { data: null, error: { message: "Authentication required" } },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "User not found" } },
      { status: 404 }
    );
  }

  const body = await request.json();
  const parsed = collectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid collection name" } },
      { status: 400 }
    );
  }

  const collection = await prisma.collection.create({
    data: {
      name: parsed.data.name,
      userId: user.id
    }
  });

  return NextResponse.json({ data: collection, error: null }, { status: 201 });
}

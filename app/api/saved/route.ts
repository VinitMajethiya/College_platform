import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { mapCollege } from "@/lib/college-service";
import { prisma } from "@/lib/prisma";
import { saveCollegeSchema } from "@/lib/validations/saved";

export async function GET() {
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

  const savedColleges = await prisma.savedCollege.findMany({
    where: { userId: user.id },
    include: {
      college: {
        include: {
          courses: true,
          reviews: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        }
      }
    }
  });

  return NextResponse.json({
    data: savedColleges.map((sc) => ({
      ...mapCollege(sc.college),
      collectionId: sc.collectionId
    })),
    error: null
  });
}

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const parsed = saveCollegeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: { message: "Invalid college id" } }, { status: 400 });
  }

  await prisma.savedCollege.upsert({
    where: {
      userId_collegeId: {
        userId: user.id,
        collegeId: parsed.data.collegeId
      }
    },
    update: {},
    create: {
      userId: user.id,
      collegeId: parsed.data.collegeId
    }
  });

  return NextResponse.json({ data: { collegeId: parsed.data.collegeId }, error: null }, { status: 201 });
}

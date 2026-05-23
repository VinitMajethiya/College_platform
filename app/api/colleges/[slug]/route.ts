import { NextResponse } from "next/server";

import { getRelatedColleges, getCollegeBySlug } from "@/lib/college-service";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const college = await getCollegeBySlug(params.slug);

  if (!college) {
    return NextResponse.json(
      { data: null, error: { message: "College not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: {
      ...college,
      related: await getRelatedColleges(params.slug)
    },
    error: null
  });
}

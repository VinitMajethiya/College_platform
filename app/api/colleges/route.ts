import { NextRequest, NextResponse } from "next/server";

import { listColleges } from "@/lib/college-service";
import { collegeListQuerySchema } from "@/lib/validations/college";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = collegeListQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid filters", details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const result = await listColleges(parsed.data);

  return NextResponse.json({
    data: result.colleges,
    pagination: result.pagination,
    error: null
  });
}

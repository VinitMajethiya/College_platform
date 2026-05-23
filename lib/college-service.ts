import { prisma } from "@/lib/prisma";
import { CourseType, College } from "@/lib/types";
import { CollegeListQuery } from "@/lib/validations/college";
import { colleges as sampleColleges, getCollegeBySlug as getSampleCollegeBySlug } from "@/lib/sample-data";

export function mapCollege(college: any): College {
  return {
    id: college.id,
    slug: college.slug,
    name: college.name,
    city: college.city,
    state: college.state,
    country: college.country,
    established: college.established,
    nirfRanking: college.nirfRanking,
    rating: college.rating,
    reviewCount: college.reviewCount,
    annualFeesMin: college.annualFeesMin,
    annualFeesMax: college.annualFeesMax,
    campusAreaAcres: college.campusAreaAcres,
    about: college.about,
    accreditations: college.accreditations,
    imageUrl: college.imageUrl,
    website: college.website,
    phone: college.phone,
    email: college.email,
    avgPackageLPA: college.avgPackageLPA,
    highestPackageLPA: college.highestPackageLPA,
    placementPercent: college.placementPercent,
    topRecruiters: college.topRecruiters,
    courses: (college.courses || []).map((course: any) => ({
      id: course.id,
      name: course.name,
      type: course.type as CourseType,
      duration: course.duration,
      annualFees: course.annualFees,
      seats: course.seats ?? 0,
      eligibility: course.eligibility ?? ""
    })),
    reviews: (college.reviews || []).map((review: any) => ({
      id: review.id,
      reviewerName: review.user?.name || "Anonymous",
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: review.createdAt instanceof Date ? review.createdAt.toISOString().split("T")[0] : String(review.createdAt)
    }))
  };
}

export async function listColleges(query: CollegeListQuery) {
  try {
    return await listDbColleges(query);
  } catch {
    return listSampleColleges(query);
  }
}

async function listDbColleges(query: CollegeListQuery) {
  const states = query.state ? query.state.split(",").filter(Boolean) : [];
  const courses = query.course ? query.course.split(",").filter(Boolean) : [];
  const search = query.search.trim();

  const where: any = {};

  if (query.ids) {
    const idList = query.ids.split(",").filter(Boolean);
    where.id = { in: idList };
  } else {
    if (search) {
      const searchCondition: any[] = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
        {
          courses: {
            some: {
              name: { contains: search, mode: "insensitive" }
            }
          }
        }
      ];

      // Support acronym expansions
      const lowerSearch = search.toLowerCase();
      if (lowerSearch === "iit") {
        searchCondition.push({ name: { startsWith: "Indian Institute of Technology", mode: "insensitive" } });
      } else if (lowerSearch === "nit") {
        searchCondition.push({ name: { startsWith: "National Institute of Technology", mode: "insensitive" } });
      } else if (lowerSearch === "iim") {
        searchCondition.push({ name: { startsWith: "Indian Institute of Management", mode: "insensitive" } });
      } else if (lowerSearch === "aiims") {
        searchCondition.push({ name: { startsWith: "All India Institute of Medical Sciences", mode: "insensitive" } });
      }

      where.OR = searchCondition;
    }

    if (states.length > 0) {
      where.state = { in: states };
    }

    if (courses.length > 0) {
      where.courses = {
        some: {
          type: { in: courses }
        }
      };
    }

    if (query.minFees !== undefined || query.maxFees !== undefined) {
      where.annualFeesMax = { gte: query.minFees ?? 0 };
      where.annualFeesMin = { lte: query.maxFees ?? 2000000 };
    }

    if (query.minRating !== undefined) {
      where.rating = { gte: query.minRating };
    }

    if (query.minRank !== undefined || query.maxRank !== undefined) {
      where.nirfRanking = {
        gte: query.minRank ?? 1,
        lte: query.maxRank ?? 9999
      };
    }
  }

  let orderBy: any = {};
  if (query.sort === "fees-asc") {
    orderBy = { annualFeesMin: "asc" };
  } else if (query.sort === "fees-desc") {
    orderBy = { annualFeesMax: "desc" };
  } else if (query.sort === "rating") {
    orderBy = { rating: "desc" };
  } else if (query.sort === "name") {
    orderBy = { name: "asc" };
  } else {
    orderBy = { nirfRanking: "asc" };
  }

  const skip = (query.page - 1) * query.pageSize;
  const take = query.pageSize;

  const [dbColleges, total] = await prisma.$transaction([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take,
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
    }),
    prisma.college.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));

  return {
    colleges: dbColleges.map(mapCollege),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages
    }
  };
}

export async function getRelatedColleges(slug: string) {
  let college;
  try {
    college = await prisma.college.findUnique({
      where: { slug },
      include: { courses: true }
    });
  } catch {
    const sampleCollege = getSampleCollegeBySlug(slug);
    if (!sampleCollege) return [];

    const courseTypes = Array.from(new Set(sampleCollege.courses.map((course) => course.type)));
    return sampleColleges
      .filter(
        (item) =>
          item.slug !== slug &&
          (item.state === sampleCollege.state || item.courses.some((course) => courseTypes.includes(course.type)))
      )
      .slice(0, 3);
  }

  if (!college) return [];

  const courseTypes = Array.from(new Set(college.courses.map((course) => course.type)));

  const related = await prisma.college.findMany({
    where: {
      slug: { not: slug },
      OR: [
        { state: college.state },
        {
          courses: {
            some: {
              type: { in: courseTypes }
            }
          }
        }
      ]
    },
    take: 3,
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
  });

  return related.map(mapCollege);
}

export async function getCollegeBySlug(slug: string) {
  try {
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!college) return null;
    return mapCollege(college);
  } catch {
    return getSampleCollegeBySlug(slug) ?? null;
  }
}

function listSampleColleges(query: CollegeListQuery) {
  const states = query.state ? query.state.split(",").filter(Boolean) : [];
  const courses = query.course ? query.course.split(",").filter(Boolean) : [];
  const ids = query.ids ? query.ids.split(",").filter(Boolean) : [];
  const search = query.search.trim().toLowerCase();

  let filtered = sampleColleges.filter((college) => {
    if (ids.length > 0 && !ids.includes(college.id)) return false;

    if (search) {
      const haystack = [
        college.name,
        college.city,
        college.state,
        ...college.courses.map((course) => `${course.name} ${course.type}`)
      ]
        .join(" ")
        .toLowerCase();

      const acronymMatch =
        (search === "iit" && college.name.toLowerCase().startsWith("indian institute of technology")) ||
        (search === "nit" && college.name.toLowerCase().startsWith("national institute of technology")) ||
        (search === "iim" && college.name.toLowerCase().startsWith("indian institute of management")) ||
        (search === "aiims" && college.name.toLowerCase().includes("aiims"));

      if (!haystack.includes(search) && !acronymMatch) return false;
    }

    if (states.length > 0 && !states.includes(college.state)) return false;

    if (courses.length > 0 && !college.courses.some((course) => courses.includes(course.type))) {
      return false;
    }

    if (query.minFees !== undefined && college.annualFeesMax < query.minFees) return false;
    if (query.maxFees !== undefined && college.annualFeesMin > query.maxFees) return false;
    if (query.minRating !== undefined && college.rating < query.minRating) return false;
    if (query.minRank !== undefined && (!college.nirfRanking || college.nirfRanking < query.minRank)) return false;
    if (query.maxRank !== undefined && (!college.nirfRanking || college.nirfRanking > query.maxRank)) return false;

    return true;
  });

  filtered = [...filtered].sort((first, second) => {
    if (query.sort === "fees-asc") return first.annualFeesMin - second.annualFeesMin;
    if (query.sort === "fees-desc") return second.annualFeesMax - first.annualFeesMax;
    if (query.sort === "rating") return second.rating - first.rating;
    if (query.sort === "name") return first.name.localeCompare(second.name);
    return (first.nirfRanking ?? 9999) - (second.nirfRanking ?? 9999);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const start = (query.page - 1) * query.pageSize;

  return {
    colleges: filtered.slice(start, start + query.pageSize),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages
    }
  };
}

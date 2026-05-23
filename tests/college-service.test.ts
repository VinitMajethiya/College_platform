import { describe, expect, it, vi } from "vitest";

import {
  getCollegeBySlug,
  getRelatedColleges,
  listColleges
} from "@/lib/college-service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    college: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn()
    },
    $transaction: vi.fn()
  }
}));

const mockCollege1 = {
  id: "indian-institute-of-technology-bombay",
  slug: "indian-institute-of-technology-bombay",
  name: "Indian Institute of Technology Bombay",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  established: 1958,
  nirfRanking: 3,
  rating: 4.8,
  reviewCount: 200,
  annualFeesMin: 220000,
  annualFeesMax: 320000,
  campusAreaAcres: 550,
  about: "About IIT Bombay",
  accreditations: ["AICTE", "NAAC"],
  imageUrl: null,
  website: "https://www.iitbombay.edu",
  phone: "+91 98765 43210",
  email: "admissions@iitbombay.edu",
  avgPackageLPA: 18,
  highestPackageLPA: 45,
  placementPercent: 95,
  topRecruiters: ["Microsoft", "Google"],
  courses: [
    {
      id: "btech-cse",
      name: "B.Tech Computer Science",
      type: "Engineering",
      duration: 4,
      annualFees: 220000,
      seats: 60,
      eligibility: "10+2 with JEE Advanced"
    }
  ],
  reviews: []
};

const mockCollege2 = {
  id: "national-institute-of-technology-trichy",
  slug: "national-institute-of-technology-trichy",
  name: "National Institute of Technology Trichy",
  city: "Tiruchirappalli",
  state: "Tamil Nadu",
  country: "India",
  established: 1964,
  nirfRanking: 9,
  rating: 4.6,
  reviewCount: 180,
  annualFeesMin: 165000,
  annualFeesMax: 240000,
  campusAreaAcres: 800,
  about: "About NIT Trichy",
  accreditations: ["AICTE", "NAAC"],
  imageUrl: null,
  website: "https://www.nitt.edu",
  phone: "+91 98765 43210",
  email: "admissions@nitt.edu",
  avgPackageLPA: 12,
  highestPackageLPA: 38,
  placementPercent: 90,
  topRecruiters: ["TCS", "Infosys"],
  courses: [],
  reviews: []
};

describe("listColleges", () => {
  it("filters colleges by search", async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([[mockCollege1], 1]);

    const result = await listColleges({
      search: "IIT Bombay",
      state: "",
      course: "",
      page: 1,
      pageSize: 12,
      sort: "ranking"
    });

    expect(result.pagination.total).toBe(1);
    expect(result.colleges[0]?.name).toContain("Bombay");
  });

  it("sorts by lowest fees", async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([
      [mockCollege2, mockCollege1],
      2
    ]);

    const result = await listColleges({
      search: "",
      state: "",
      course: "",
      page: 1,
      pageSize: 12,
      sort: "fees-asc"
    });

    expect(result.colleges[0].annualFeesMin).toBeLessThanOrEqual(
      result.colleges[1].annualFeesMin
    );
  });
});

describe("getCollegeBySlug", () => {
  it("returns the college by slug from the database", async () => {
    vi.mocked(prisma.college.findUnique).mockResolvedValueOnce(
      mockCollege1 as any
    );

    const result = await getCollegeBySlug(
      "indian-institute-of-technology-bombay"
    );
    expect(result).not.toBeNull();
    expect(result?.slug).toBe("indian-institute-of-technology-bombay");
  });

  it("falls back to sample data if database query fails or is empty", async () => {
    vi.mocked(prisma.college.findUnique).mockRejectedValueOnce(
      new Error("DB error")
    );

    const result = await getCollegeBySlug(
      "indian-institute-of-technology-bombay"
    );
    expect(result).not.toBeNull();
    expect(result?.slug).toBe("indian-institute-of-technology-bombay");
  });
});

describe("getRelatedColleges", () => {
  it("returns related colleges matching state or course type", async () => {
    vi.mocked(prisma.college.findUnique).mockResolvedValueOnce(
      mockCollege1 as any
    );
    vi.mocked(prisma.college.findMany).mockResolvedValueOnce([
      mockCollege2
    ] as any);

    const result = await getRelatedColleges(
      "indian-institute-of-technology-bombay"
    );
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("national-institute-of-technology-trichy");
  });

  it("falls back to sample related colleges if database fails", async () => {
    vi.mocked(prisma.college.findUnique).mockRejectedValueOnce(
      new Error("DB error")
    );

    const result = await getRelatedColleges(
      "indian-institute-of-technology-bombay"
    );
    expect(result.length).toBeGreaterThan(0);
  });
});

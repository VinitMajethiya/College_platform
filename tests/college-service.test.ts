import { vi, describe, expect, it } from "vitest";

import { listColleges } from "@/lib/college-service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    college: {
      findMany: vi.fn(),
      count: vi.fn()
    },
    $transaction: vi.fn()
  }
}));

const mockCollege1 = {
  id: "iit-bombay",
  slug: "iit-bombay",
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
  id: "nit-trichy",
  slug: "nit-trichy",
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
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([[mockCollege2, mockCollege1], 2]);

    const result = await listColleges({
      search: "",
      state: "",
      course: "",
      page: 1,
      pageSize: 12,
      sort: "fees-asc"
    });

    expect(result.colleges[0].annualFeesMin).toBeLessThanOrEqual(result.colleges[1].annualFeesMin);
  });
});

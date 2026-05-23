export type CourseType = "Engineering" | "Medical" | "Management" | "Arts" | "Science" | "Law";

export type Course = {
  id: string;
  name: string;
  type: CourseType;
  duration: number;
  annualFees: number;
  seats: number;
  eligibility: string;
};

export type Review = {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export type College = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  country: string;
  established: number;
  nirfRanking: number | null;
  rating: number;
  reviewCount: number;
  annualFeesMin: number;
  annualFeesMax: number;
  campusAreaAcres: number | null;
  about: string;
  accreditations: string[];
  imageUrl?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  avgPackageLPA: number | null;
  highestPackageLPA: number | null;
  placementPercent: number | null;
  topRecruiters: string[];
  courses: Course[];
  reviews: Review[];
};

export type CollegeListResponse = {
  colleges: College[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

import { College, CourseType } from "@/lib/types";
import { slugify } from "@/lib/utils";

const courseTemplates: Record<CourseType, string[]> = {
  Engineering: [
    "B.Tech Computer Science",
    "B.Tech Mechanical Engineering",
    "M.Tech Data Science"
  ],
  Medical: ["MBBS", "MD General Medicine", "B.Sc Nursing"],
  Management: ["MBA", "PGDM Finance", "Executive MBA"],
  Arts: ["BA Economics", "BA Psychology", "MA Public Policy"],
  Science: ["B.Sc Physics", "B.Sc Biotechnology", "M.Sc Data Science"],
  Law: ["BA LLB", "LLM Corporate Law", "BBA LLB"]
};

const specs = [
  [
    "Indian Institute of Technology Bombay",
    "Mumbai",
    "Maharashtra",
    1958,
    3,
    4.8,
    220000,
    320000,
    550,
    "Engineering"
  ],
  [
    "Indian Institute of Technology Delhi",
    "New Delhi",
    "Delhi",
    1961,
    2,
    4.8,
    215000,
    310000,
    325,
    "Engineering"
  ],
  [
    "Indian Institute of Technology Madras",
    "Chennai",
    "Tamil Nadu",
    1959,
    1,
    4.9,
    210000,
    305000,
    620,
    "Engineering"
  ],
  [
    "Indian Institute of Technology Kanpur",
    "Kanpur",
    "Uttar Pradesh",
    1959,
    4,
    4.7,
    214000,
    300000,
    1055,
    "Engineering"
  ],
  [
    "Indian Institute of Technology Kharagpur",
    "Kharagpur",
    "West Bengal",
    1951,
    5,
    4.7,
    218000,
    315000,
    2100,
    "Engineering"
  ],
  [
    "National Institute of Technology Trichy",
    "Tiruchirappalli",
    "Tamil Nadu",
    1964,
    9,
    4.6,
    165000,
    240000,
    800,
    "Engineering"
  ],
  [
    "National Institute of Technology Surathkal",
    "Mangaluru",
    "Karnataka",
    1960,
    12,
    4.5,
    160000,
    235000,
    295,
    "Engineering"
  ],
  [
    "National Institute of Technology Warangal",
    "Warangal",
    "Telangana",
    1959,
    21,
    4.4,
    155000,
    230000,
    248,
    "Engineering"
  ],
  [
    "National Institute of Technology Rourkela",
    "Rourkela",
    "Odisha",
    1961,
    16,
    4.4,
    150000,
    225000,
    1200,
    "Engineering"
  ],
  [
    "National Institute of Technology Calicut",
    "Kozhikode",
    "Kerala",
    1961,
    25,
    4.3,
    145000,
    220000,
    300,
    "Engineering"
  ],
  [
    "Indian Institute of Management Ahmedabad",
    "Ahmedabad",
    "Gujarat",
    1961,
    1,
    4.9,
    1200000,
    1800000,
    102,
    "Management"
  ],
  [
    "Indian Institute of Management Bangalore",
    "Bengaluru",
    "Karnataka",
    1973,
    2,
    4.8,
    1150000,
    1750000,
    100,
    "Management"
  ],
  [
    "Indian Institute of Management Kozhikode",
    "Kozhikode",
    "Kerala",
    1996,
    3,
    4.7,
    1000000,
    1550000,
    112,
    "Management"
  ],
  [
    "Vellore Institute of Technology",
    "Vellore",
    "Tamil Nadu",
    1984,
    11,
    4.3,
    198000,
    780000,
    372,
    "Engineering"
  ],
  [
    "SRM Institute of Science and Technology",
    "Chennai",
    "Tamil Nadu",
    1985,
    28,
    4.1,
    175000,
    450000,
    250,
    "Engineering"
  ],
  [
    "Manipal Institute of Technology",
    "Manipal",
    "Karnataka",
    1957,
    61,
    4.2,
    335000,
    475000,
    188,
    "Engineering"
  ],
  [
    "Dr. D. Y. Patil Institute of Technology",
    "Pune",
    "Maharashtra",
    1998,
    151,
    4.0,
    120000,
    190000,
    29,
    "Engineering"
  ],
  [
    "Birla Institute of Technology and Science Pilani",
    "Pilani",
    "Rajasthan",
    1964,
    20,
    4.6,
    540000,
    620000,
    328,
    "Engineering"
  ],
  [
    "Thapar Institute of Engineering and Technology",
    "Patiala",
    "Punjab",
    1956,
    22,
    4.3,
    420000,
    560000,
    250,
    "Engineering"
  ],
  [
    "Amrita Vishwa Vidyapeetham",
    "Coimbatore",
    "Tamil Nadu",
    1994,
    7,
    4.4,
    260000,
    420000,
    400,
    "Engineering"
  ],
  [
    "AIIMS Delhi",
    "New Delhi",
    "Delhi",
    1956,
    1,
    4.9,
    7000,
    22000,
    115,
    "Medical"
  ],
  [
    "Christian Medical College Vellore",
    "Vellore",
    "Tamil Nadu",
    1900,
    3,
    4.8,
    48000,
    180000,
    200,
    "Medical"
  ],
  [
    "Kasturba Medical College Mangalore",
    "Mangaluru",
    "Karnataka",
    1955,
    30,
    4.4,
    1450000,
    1850000,
    31,
    "Medical"
  ],
  [
    "Armed Forces Medical College",
    "Pune",
    "Maharashtra",
    1948,
    34,
    4.6,
    90000,
    130000,
    119,
    "Medical"
  ],
  [
    "Maulana Azad Medical College",
    "New Delhi",
    "Delhi",
    1959,
    24,
    4.5,
    12000,
    45000,
    30,
    "Medical"
  ],
  [
    "Ashoka University",
    "Sonipat",
    "Haryana",
    2014,
    88,
    4.5,
    950000,
    1250000,
    25,
    "Arts"
  ],
  [
    "FLAME University",
    "Pune",
    "Maharashtra",
    2015,
    96,
    4.2,
    800000,
    1100000,
    70,
    "Arts"
  ],
  [
    "O. P. Jindal Global University",
    "Sonipat",
    "Haryana",
    2009,
    72,
    4.3,
    650000,
    900000,
    80,
    "Law"
  ],
  [
    "National Law School of India University",
    "Bengaluru",
    "Karnataka",
    1986,
    1,
    4.8,
    310000,
    420000,
    23,
    "Law"
  ],
  [
    "NALSAR University of Law",
    "Hyderabad",
    "Telangana",
    1998,
    3,
    4.6,
    250000,
    360000,
    55,
    "Law"
  ],
  [
    "St. Stephen's College",
    "New Delhi",
    "Delhi",
    1881,
    14,
    4.5,
    45000,
    90000,
    69,
    "Arts"
  ],
  [
    "Loyola College",
    "Chennai",
    "Tamil Nadu",
    1925,
    7,
    4.4,
    35000,
    120000,
    99,
    "Arts"
  ],
  [
    "Miranda House",
    "New Delhi",
    "Delhi",
    1948,
    1,
    4.6,
    20000,
    75000,
    15,
    "Arts"
  ],
  [
    "Presidency University",
    "Kolkata",
    "West Bengal",
    1817,
    101,
    4.2,
    25000,
    85000,
    14,
    "Science"
  ],
  [
    "Indian Institute of Science",
    "Bengaluru",
    "Karnataka",
    1909,
    1,
    4.9,
    35000,
    220000,
    440,
    "Science"
  ],
  [
    "University of Hyderabad",
    "Hyderabad",
    "Telangana",
    1974,
    10,
    4.3,
    15000,
    65000,
    2300,
    "Science"
  ],
  [
    "Savitribai Phule Pune University",
    "Pune",
    "Maharashtra",
    1949,
    35,
    4.1,
    18000,
    98000,
    411,
    "Science"
  ],
  [
    "Delhi Technological University",
    "New Delhi",
    "Delhi",
    1941,
    29,
    4.3,
    236000,
    310000,
    164,
    "Engineering"
  ],
  [
    "Jadavpur University",
    "Kolkata",
    "West Bengal",
    1955,
    10,
    4.5,
    10000,
    60000,
    58,
    "Engineering"
  ],
  [
    "College of Engineering Pune Technological University",
    "Pune",
    "Maharashtra",
    1854,
    73,
    4.2,
    90000,
    145000,
    36,
    "Engineering"
  ],
  [
    "PSG College of Technology",
    "Coimbatore",
    "Tamil Nadu",
    1951,
    63,
    4.2,
    85000,
    220000,
    45,
    "Engineering"
  ],
  [
    "R. V. College of Engineering",
    "Bengaluru",
    "Karnataka",
    1963,
    96,
    4.2,
    250000,
    420000,
    52,
    "Engineering"
  ],
  [
    "Jamia Millia Islamia",
    "New Delhi",
    "Delhi",
    1920,
    3,
    4.4,
    16000,
    95000,
    239,
    "Arts"
  ],
  [
    "Banaras Hindu University",
    "Varanasi",
    "Uttar Pradesh",
    1916,
    5,
    4.5,
    12000,
    90000,
    1300,
    "Science"
  ],
  [
    "Aligarh Muslim University",
    "Aligarh",
    "Uttar Pradesh",
    1920,
    9,
    4.3,
    14000,
    85000,
    1155,
    "Arts"
  ],
  [
    "Symbiosis Institute of Business Management",
    "Pune",
    "Maharashtra",
    1978,
    17,
    4.3,
    1050000,
    1450000,
    300,
    "Management"
  ],
  [
    "XLRI Xavier School of Management",
    "Jamshedpur",
    "Jharkhand",
    1949,
    9,
    4.7,
    1200000,
    1650000,
    50,
    "Management"
  ],
  [
    "SPJIMR Mumbai",
    "Mumbai",
    "Maharashtra",
    1981,
    20,
    4.5,
    980000,
    1420000,
    45,
    "Management"
  ],
  [
    "Grant Medical College",
    "Mumbai",
    "Maharashtra",
    1845,
    13,
    4.4,
    80000,
    180000,
    44,
    "Medical"
  ],
  [
    "King George's Medical University",
    "Lucknow",
    "Uttar Pradesh",
    1905,
    12,
    4.5,
    54000,
    160000,
    100,
    "Medical"
  ],
  [
    "Gujarat National Law University",
    "Gandhinagar",
    "Gujarat",
    2003,
    7,
    4.4,
    230000,
    340000,
    50,
    "Law"
  ],
  [
    "Christ University",
    "Bengaluru",
    "Karnataka",
    1969,
    67,
    4.2,
    180000,
    420000,
    75,
    "Arts"
  ]
] as const;

function makeCourses(type: CourseType, minFee: number) {
  return courseTemplates[type].map((name, index) => ({
    id: `${slugify(name)}-${index}`,
    name,
    type,
    duration:
      type === "Management"
        ? 2
        : type === "Medical" && index === 0
          ? 5
          : index === 2
            ? 2
            : 4,
    annualFees: Math.round(minFee * (1 + index * 0.18)),
    seats: 60 + index * 45,
    eligibility:
      type === "Medical"
        ? "NEET qualification with 10+2 Biology"
        : type === "Management"
          ? "Graduation with entrance test score"
          : "10+2 or equivalent with relevant subjects"
  }));
}

export const colleges: College[] = specs.map((item, index) => {
  const [
    name,
    city,
    state,
    established,
    rank,
    rating,
    minFee,
    maxFee,
    acres,
    type
  ] = item;
  const slug = slugify(name);

  return {
    id: slug,
    slug,
    name,
    city,
    state,
    country: "India",
    established,
    nirfRanking: rank,
    rating,
    reviewCount: 180 + index * 17,
    annualFeesMin: minFee,
    annualFeesMax: maxFee,
    campusAreaAcres: acres,
    about: `${name} is a respected Indian institution known for rigorous academics, active campus life, and strong student outcomes across ${type.toLowerCase()} programs.`,
    accreditations:
      type === "Engineering"
        ? ["AICTE", "NAAC"]
        : type === "Medical"
          ? ["NMC", "NAAC"]
          : ["UGC", "NAAC"],
    imageUrl: null,
    website: `https://www.${slug.replaceAll("-", "")}.edu`,
    phone: "+91 98765 43210",
    email: `admissions@${slug.replaceAll("-", "")}.edu`,
    avgPackageLPA:
      type === "Arts" || type === "Science"
        ? 8 + (index % 8)
        : 12 + (index % 14),
    highestPackageLPA:
      type === "Medical" ? 24 + (index % 10) : 38 + (index % 36),
    placementPercent: 78 + (index % 20),
    topRecruiters:
      type === "Medical"
        ? ["Apollo", "Fortis", "Medanta", "Max Healthcare"]
        : ["TCS", "Infosys", "Deloitte", "Microsoft", "Amazon"].slice(
            0,
            4 + (index % 2)
          ),
    courses: makeCourses(type, minFee),
    reviews: [
      {
        id: `${slug}-review-1`,
        reviewerName: "Ananya Sharma",
        rating: Math.min(5, Math.round(rating)),
        title: "Strong academics and helpful seniors",
        body: "The curriculum is demanding, but faculty support and peer learning make the experience rewarding.",
        createdAt: "2026-01-12"
      },
      {
        id: `${slug}-review-2`,
        reviewerName: "Rohan Mehta",
        rating: Math.max(1, Math.round(rating - 0.4)),
        title: "Good placements with room for better facilities",
        body: "Placement preparation is structured and clubs are active. Some infrastructure upgrades would help.",
        createdAt: "2025-11-05"
      }
    ]
  };
});

export function getCollegeBySlug(slug: string) {
  return colleges.find((college) => college.slug === slug);
}

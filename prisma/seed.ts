import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

import { colleges } from "../lib/sample-data";

console.log(
  "Seeding Database URL:",
  process.env.DATABASE_URL?.replace(/:[^:@]*@/, ":***@")
);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  const reviewer = await prisma.user.upsert({
    where: { email: "seed-reviewer@univerdict.local" },
    update: {},
    create: {
      email: "seed-reviewer@univerdict.local",
      name: "UniVerdict Reviewer"
    }
  });

  for (const college of colleges) {
    await prisma.college.upsert({
      where: { slug: college.slug },
      update: {},
      create: {
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
        courses: {
          create: college.courses.map((course) => ({
            name: course.name,
            type: course.type,
            duration: course.duration,
            annualFees: course.annualFees,
            seats: course.seats,
            eligibility: course.eligibility
          }))
        },
        reviews: {
          create: college.reviews.map((review) => ({
            userId: reviewer.id,
            rating: review.rating,
            title: review.title,
            body: review.body,
            createdAt: new Date(review.createdAt)
          }))
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

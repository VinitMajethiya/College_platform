"use client";

import { useState, useMemo } from "react";
import { BookOpen, Award, GraduationCap, Star, Search, ShieldCheck, Mail, Phone, Calendar, Map, CheckCircle2 } from "lucide-react";
import { College, Course, Review } from "@/lib/types";
import { formatFeeRange, formatCurrencyINR } from "@/lib/utils";

interface CollegeDetailTabsProps {
  college: College;
}

type TabType = "overview" | "courses" | "placements" | "reviews";

export function CollegeDetailTabs({ college }: CollegeDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Course search and filtering states
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState<string>("All");

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "courses", label: "Courses Offered", icon: GraduationCap },
    { id: "placements", label: "Placements", icon: Award },
    { id: "reviews", label: "Student Reviews", icon: Star },
  ];

  // Dynamically calculate course types
  const courseTypes = useMemo(() => {
    const types = new Set(college.courses.map((c) => c.type));
    return ["All", ...Array.from(types)];
  }, [college.courses]);

  // Filter courses based on search & dropdown selection
  const filteredCourses = useMemo(() => {
    return college.courses.filter((course) => {
      const matchesSearch = course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        (course.eligibility || "").toLowerCase().includes(courseSearch.toLowerCase());
      const matchesType = selectedCourseType === "All" || course.type === selectedCourseType;
      return matchesSearch && matchesType;
    });
  }, [college.courses, courseSearch, selectedCourseType]);

  // Calculate review breakdown percentages dynamically based on seeded reviews
  const reviewBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let total = 0;

    college.reviews.forEach((r) => {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rating]++;
      total++;
    });

    // Provide default fallback percentages based on overall rating if no reviews are seeded
    if (total === 0) {
      const baseRating = college.rating;
      return [5, 4, 3, 2, 1].map((star) => {
        let pct = 0;
        if (star === 5 && baseRating >= 4.5) pct = 65;
        else if (star === 4) pct = baseRating >= 4.0 ? 25 : 45;
        else if (star === 3) pct = 10;
        else if (star === 2) pct = 4;
        else pct = 1;
        return { rating: star, percent: pct, count: Math.round(college.reviewCount * (pct / 100)) };
      });
    }

    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star as 1 | 2 | 3 | 4 | 5];
      const percent = Math.round((count / total) * 100);
      return {
        rating: star,
        percent,
        count: Math.round(college.reviewCount * (percent / 100))
      };
    });
  }, [college.reviews, college.rating, college.reviewCount]);

  return (
    <div className="space-y-6">
      {/* Premium Tabs Buttons */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none sticky top-16 bg-white dark:bg-slate-900 z-30 py-1">
        <div className="flex space-x-1 sm:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap outline-none ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                {tab.label}
                {tab.id === "reviews" && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300" : "bg-slate-100 text-slate-655 dark:bg-slate-800 dark:text-slate-450"
                  }`}>
                    {college.reviewCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="mt-4 transition-all duration-300">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-soft transition-all duration-300 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4 border-slate-100 dark:border-slate-850">
                <BookOpen className="h-5 w-5 text-blue-500" />
                About {college.name}
              </h3>
              <p className="mt-4 text-slate-650 dark:text-slate-300 leading-relaxed text-base">
                {college.about}
              </p>

              <div className="mt-8">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Accreditations & Affiliations</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {college.accreditations.map((acc) => (
                    <span
                      key={acc}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-sm font-semibold text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {acc} Certified
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Facts Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4 border-slate-100 dark:border-slate-850">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  Key Facts
                </h3>
                <dl className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <dt className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Established</dt>
                      <dd className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">{college.established}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Map className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <dt className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Campus Size</dt>
                      <dd className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {college.campusAreaAcres ? `${college.campusAreaAcres} Acres` : "N/A"}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Admissions & Contact */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4 border-slate-100 dark:border-slate-850">
                  Admissions Contact
                </h3>
                <div className="mt-4 space-y-3">
                  {college.email && (
                    <a
                      href={`mailto:${college.email}`}
                      className="flex items-center gap-3 text-sm text-slate-650 dark:text-slate-350 hover:text-blue-500 transition-colors"
                    >
                      <Mail className="h-4.5 w-4.5 text-slate-400" />
                      <span className="truncate">{college.email}</span>
                    </a>
                  )}
                  {college.phone && (
                    <a
                      href={`tel:${college.phone}`}
                      className="flex items-center gap-3 text-sm text-slate-650 dark:text-slate-350 hover:text-blue-500 transition-colors"
                    >
                      <Phone className="h-4.5 w-4.5 text-slate-400" />
                      <span>{college.phone}</span>
                    </a>
                  )}
                  {college.website && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block w-full rounded-xl bg-slate-50 border text-center py-2.5 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                      Visit Official Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES OFFERED TAB */}
        {activeTab === "courses" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4 border-slate-100 dark:border-slate-850">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Available Courses ({filteredCourses.length})
              </h3>

              {/* Course Search & Filter Bar */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative min-w-[200px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-900"
                  />
                </div>

                <select
                  aria-label="Filter courses by type"
                  value={selectedCourseType}
                  onChange={(e) => setSelectedCourseType(e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  {courseTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Courses Table */}
            {filteredCourses.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500">No courses match your filter criteria.</p>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px] dark:border-slate-850">
                    <tr>
                      <th className="py-3.5 pr-4">Course Details</th>
                      <th className="py-3.5 px-4">Course Type</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Annual Fees</th>
                      <th className="py-3.5 px-4">Seats</th>
                      <th className="py-3.5 pl-4">Eligibility Criteria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/35 transition-colors">
                        <td className="py-4 pr-4 font-bold text-slate-800 dark:text-slate-200">{course.name}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100/50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30">
                            {course.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-650 dark:text-slate-350">{course.duration} Years</td>
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {formatFeeRange(course.annualFees, course.annualFees)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {course.seats || "N/A"}
                        </td>
                        <td className="py-4 pl-4 text-slate-600 dark:text-slate-400 max-w-[240px] truncate" title={course.eligibility || ""}>
                          {course.eligibility || "10+2 with minimum required percentage"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PLACEMENTS TAB */}
        {activeTab === "placements" && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Average Salary Package</p>
                <p className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-455">
                  {college.avgPackageLPA ? `${college.avgPackageLPA} LPA` : "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Highest Salary Package</p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-455">
                  {college.highestPackageLPA ? `${college.highestPackageLPA} LPA` : "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Placement Success Rate</p>
                <p className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-455">
                  {college.placementPercent ? `${college.placementPercent}%` : "N/A"}
                </p>
              </div>
            </div>

            {/* recruiters and details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4 border-slate-100 dark:border-slate-850">
                Top Recruiters
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {college.topRecruiters.map((recruiter) => (
                  <span
                    key={recruiter}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {recruiter.charAt(0)}
                    </span>
                    {recruiter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STUDENT REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Aggregate Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 h-fit">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-4 border-slate-100 dark:border-slate-850">
                Rating Breakdown
              </h3>
              <div className="mt-4 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 text-4xl font-extrabold text-slate-900 dark:text-white">
                  <span>{college.rating.toFixed(1)}</span>
                  <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-400">{college.reviewCount} Ratings</p>
              </div>

              <div className="mt-6 space-y-2">
                {reviewBreakdown.map((row) => (
                  <div key={row.rating} className="grid grid-cols-[32px_1fr_42px] items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-655 dark:text-slate-350">{row.rating}★</span>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="text-right font-medium text-slate-500" title={`${row.count} reviews`}>
                      {row.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                All Reviews ({college.reviews.length})
              </h3>
              {college.reviews.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-slate-500">No student reviews submitted yet. Be the first to share your experience!</p>
                </div>
              ) : (
                college.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-soft transition-all duration-200 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700 border border-blue-100 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800">
                          {review.reviewerName.charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-850 dark:text-slate-200">{review.reviewerName}</p>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Student</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 self-start sm:self-center">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-850"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500">{review.createdAt}</span>
                      </div>
                    </div>

                    <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                      {review.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-655 dark:text-slate-350">
                      {review.body}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

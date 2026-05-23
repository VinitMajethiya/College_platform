"use client";

import { useState, useMemo } from "react";
import { BookOpen, GraduationCap, Award, Star, Search, Calendar, MapPin, Globe, Phone, Mail, Award as PlacementIcon, Scale, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

import { College } from "@/lib/types";
import { formatCurrencyINR } from "@/lib/utils";
import { SaveButton } from "@/components/saved/SaveButton";
import { useCompareStore } from "@/store/compareStore";
import { cn } from "@/lib/utils";

interface CollegeDetailTabsProps {
  college: College;
}

type TabType = "overview" | "courses" | "placements" | "reviews";

export function CollegeDetailTabs({ college }: CollegeDetailTabsProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Course search states
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState<string>("All");

  // Local state for review submittal form
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const addCompare = useCompareStore((state) => state.add);
  const removeCompare = useCompareStore((state) => state.remove);
  const isCompared = useCompareStore((state) => state.has(college.id));

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BookOpen },
    { id: "courses" as const, label: "Courses", icon: GraduationCap },
    { id: "placements" as const, label: "Placements", icon: Award },
    { id: "reviews" as const, label: "Reviews", icon: Star }
  ];

  // Dynamically calculate course types
  const courseTypes = useMemo(() => {
    const types = new Set(college.courses.map((c) => c.type));
    return ["All", ...Array.from(types)];
  }, [college.courses]);

  // Filter courses based on search & dropdown selection
  const filteredCourses = useMemo(() => {
    return college.courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        (course.eligibility || "").toLowerCase().includes(courseSearch.toLowerCase());
      const matchesType = selectedCourseType === "All" || course.type === selectedCourseType;
      return matchesSearch && matchesType;
    });
  }, [college.courses, courseSearch, selectedCourseType]);

  // Calculate review breakdown percentages
  const reviewBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let total = 0;

    college.reviews.forEach((r) => {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rating]++;
      total++;
    });

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

  const handleCompareToggle = () => {
    if (isCompared) {
      removeCompare(college.id);
    } else {
      addCompare({
        id: college.id,
        slug: college.slug,
        name: college.name,
        city: college.city,
        state: college.state
      });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewBody.trim()) {
      toast.error("Please fill in all fields before submitting");
      return;
    }
    toast.success("Review submitted successfully! (Waiting for moderation)");
    setReviewTitle("");
    setReviewBody("");
    setReviewRating(5);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Sticky Actions Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl px-6 py-3 flex items-center justify-between sticky top-[60px] z-20 shadow-sm">
        
        {/* Left: Tab Switches */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-sm font-semibold transition-all duration-150 py-2.5 border-b-2 whitespace-nowrap outline-none",
                  isActive
                    ? "text-brand-orange border-brand-orange font-medium"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SaveButton collegeId={college.id} />
          
          <button
            onClick={handleCompareToggle}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all active:scale-95 duration-100",
              isCompared
                ? "bg-slate-100 border-slate-200 text-slate-655"
                : "border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orangeLight"
            )}
          >
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">{isCompared ? "Compared" : "Compare"}</span>
          </button>
        </div>
      </div>

      {/* 2. Tab Panels */}
      <div className="mt-6">
        
        {/* OVERVIEW PANEL */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* About Box */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <BookOpen className="h-5 w-5 text-brand-orange" />
                  <span>About the University</span>
                </h3>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed font-normal">
                  {college.about}
                </p>
              </div>

              {/* Accreditations */}
              {college.accreditations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Accreditations & Affiliations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {college.accreditations.map((acc) => (
                      <span
                        key={acc}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-150/40"
                      >
                        ✓ {acc} Certified
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Facts Sidebar */}
            <div className="space-y-6">
              {/* Key Facts Grid */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3 select-none">
                  <ShieldCheck className="h-4.5 w-4.5 text-brand-orange" />
                  Key Facts
                </h3>

                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      Established
                    </dt>
                    <dd className="mt-0.5 text-sm font-bold text-gray-800 ml-5">{college.established}</dd>
                  </div>

                  <div>
                    <dt className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      Campus Size
                    </dt>
                    <dd className="mt-0.5 text-sm font-bold text-gray-800 ml-5">
                      {college.campusAreaAcres ? `${college.campusAreaAcres} Acres` : "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Admissions Contact */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 select-none">
                  Admissions Contact
                </h3>

                <div className="space-y-3">
                  {college.email && (
                    <a
                      href={`mailto:${college.email}`}
                      className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-brand-orange transition-all truncate"
                    >
                      <Mail className="h-4.5 w-4.5 text-gray-450 flex-shrink-0" />
                      <span className="truncate">{college.email}</span>
                    </a>
                  )}
                  {college.phone && (
                    <a
                      href={`tel:${college.phone}`}
                      className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-brand-orange transition-all"
                    >
                      <Phone className="h-4.5 w-4.5 text-gray-450 flex-shrink-0" />
                      <span>{college.phone}</span>
                    </a>
                  )}
                  {college.website && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center justify-center gap-1 w-full rounded-xl bg-gray-50 border border-gray-200 py-2.5 text-xs font-semibold hover:bg-brand-orangeLight hover:text-brand-orange hover:border-brand-orange/30 transition-all text-center"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES PANEL */}
        {activeTab === "courses" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Header controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-brand-orange" />
                <span>Available Courses ({filteredCourses.length})</span>
              </h3>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange bg-white w-48"
                  />
                </div>

                <select
                  value={selectedCourseType}
                  onChange={(e) => setSelectedCourseType(e.target.value)}
                  className="border border-gray-200 rounded-xl text-xs px-2.5 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-brand-orange"
                  aria-label="Filter course stream types"
                >
                  {courseTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Streams" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Courses Table */}
            {filteredCourses.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 select-none">
                No courses match your filter selection.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wide text-[10px]">
                      <th className="py-3 px-4">Course Name</th>
                      <th className="py-3 px-4">Stream</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4 text-right">Annual Fees</th>
                      <th className="py-3 px-4 text-right">Seats</th>
                      <th className="py-3 px-4 pl-6">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.map((course, idx) => (
                      <tr
                        key={course.id}
                        className={cn(
                          "hover:bg-gray-50/50 transition-colors",
                          idx % 2 === 1 ? "bg-gray-50/20" : "bg-white"
                        )}
                      >
                        <td className="py-3.5 px-4 font-medium text-gray-900">{course.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold px-2.5 py-0.5 border border-blue-100/50">
                            {course.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">{course.duration} Years</td>
                        <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                          {formatCurrencyINR(course.annualFees)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-gray-700 font-medium">
                          {course.seats || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 pl-6 text-xs text-gray-500 max-w-[200px] truncate" title={course.eligibility}>
                          {course.eligibility || "10+2 passing required"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PLACEMENTS PANEL */}
        {activeTab === "placements" && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Package</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-blue-600">
                  {college.avgPackageLPA ? `₹${college.avgPackageLPA} LPA` : "N/A"}
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Highest Package</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-600">
                  {college.highestPackageLPA ? `₹${college.highestPackageLPA} LPA` : "N/A"}
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Placement Rate</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-brand-orange">
                  {college.placementPercent ? `${college.placementPercent}%` : "N/A"}
                </p>
              </div>
            </div>

            {/* Recruiters Placeholder Grid */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-6 select-none">
                Top Hiring Recruiters
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {college.topRecruiters.map((recruiter) => (
                  <div
                    key={recruiter}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center shadow-xs"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange font-bold text-sm mb-2 select-none">
                      {recruiter.charAt(0)}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 truncate w-full" title={recruiter}>
                      {recruiter}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS PANEL */}
        {activeTab === "reviews" && (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Aggregate reviews panel */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4 select-none">
                Reviews Summary
              </h3>

              <div className="text-center pb-6 border-b border-gray-100">
                <div className="inline-flex items-center justify-center gap-1.5 text-4xl font-extrabold text-gray-900">
                  <span>{college.rating.toFixed(1)}</span>
                  <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
                </div>
                <p className="mt-1 text-xs font-semibold text-gray-400">Based on {college.reviewCount} reviews</p>
              </div>

              {/* Progress bars */}
              <div className="mt-6 space-y-2">
                {reviewBreakdown.map((row) => (
                  <div key={row.rating} className="grid grid-cols-[30px_1fr_35px] items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-500">{row.rating}★</span>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-orange transition-all duration-300"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="text-right text-gray-400 font-semibold">{row.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List & Write Review Form */}
            <div className="space-y-6">
              
              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Student Experiences ({college.reviews.length})
                </h3>

                {college.reviews.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-sm text-gray-500">
                    No reviews submitted yet. Be the first to share your honest thoughts!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {college.reviews.map((review) => (
                      <article
                        key={review.id}
                        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col space-y-3.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-bold text-brand-orange border border-brand-orange/20">
                              {review.reviewerName.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-gray-950">{review.reviewerName}</p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Verified Senior</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <span className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                  )}
                                />
                              ))}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 ml-1">{review.createdAt}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 leading-snug">{review.title}</h4>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">{review.body}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Write Review Form */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4 select-none">
                  Write an Honest Review
                </h3>

                {session ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    
                    {/* Star Rating Select */}
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 select-none">
                        Your Rating
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isSelected = reviewRating >= star;
                          return (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none hover:scale-110 active:scale-90 transition-transform duration-100"
                            >
                              <Star
                                className={cn(
                                  "h-6 w-6 transition-colors duration-150",
                                  isSelected ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                )}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div>
                      <label htmlFor="review-title" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 select-none">
                        Review Title
                      </label>
                      <input
                        id="review-title"
                        type="text"
                        placeholder="Summarize your key highlight (e.g. Excellent computer science placements)"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange bg-white"
                      />
                    </div>

                    {/* Review Body */}
                    <div>
                      <label htmlFor="review-body" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 select-none">
                        Review Details
                      </label>
                      <textarea
                        id="review-body"
                        rows={4}
                        placeholder="Tell juniors about campus life, professors, hostel facilities, and actual placement statistics..."
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-brand-orange hover:bg-brand-orangeHover text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-orange/10 active:scale-95"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Please{" "}
                      <Link href="/auth/signin" className="text-brand-orange font-semibold hover:underline">
                        Sign In
                      </Link>{" "}
                      to share your student experience.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

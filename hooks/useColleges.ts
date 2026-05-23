import { useQuery } from "@tanstack/react-query";

import { College } from "@/lib/types";

interface CollegeListResponse {
  data: College[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function useColleges(params: Record<string, any>) {
  return useQuery<CollegeListResponse>({
    queryKey: ["colleges", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const res = await fetch(`/api/colleges?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch colleges");
      return res.json();
    }
  });
}

export function useCollege(slug: string) {
  return useQuery<{ data: College }>({
    queryKey: ["college", slug],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch college details");
      return res.json();
    }
  });
}

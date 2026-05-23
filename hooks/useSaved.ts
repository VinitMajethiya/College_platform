import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { College } from "@/lib/types";

export interface Collection {
  id: string;
  name: string;
  colleges?: { collegeId: string }[];
}

export function useSavedColleges() {
  return useQuery<{ data: College[] }>({
    queryKey: ["savedColleges"],
    queryFn: async () => {
      const res = await fetch("/api/saved");
      if (res.status === 401) {
        return { data: [] };
      }
      if (!res.ok) throw new Error("Failed to fetch saved colleges");
      return res.json();
    }
  });
}

export function useSaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId })
      });
      if (res.status === 401)
        throw new Error("Please sign in to save colleges");
      if (!res.ok) throw new Error("Failed to save college");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedColleges"] });
    }
  });
}

export function useUnsaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch(`/api/saved/${collegeId}`, {
        method: "DELETE"
      });
      if (res.status === 401)
        throw new Error("Please sign in to save colleges");
      if (!res.ok) throw new Error("Failed to remove saved college");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedColleges"] });
    }
  });
}

export function useCollections() {
  return useQuery<{ data: Collection[] }>({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      if (res.status === 401) {
        return { data: [] };
      }
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json();
    }
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (res.status === 401)
        throw new Error("Please sign in to manage collections");
      if (!res.ok) throw new Error("Failed to create collection");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    }
  });
}

export function useAssignCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      collegeId
    }: {
      collectionId: string;
      collegeId: string;
    }) => {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId })
      });
      if (res.status === 401)
        throw new Error("Please sign in to manage collections");
      if (!res.ok) throw new Error("Failed to assign college to collection");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedColleges"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    }
  });
}

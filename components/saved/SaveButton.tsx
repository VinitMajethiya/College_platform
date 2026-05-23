"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  useSavedColleges,
  useSaveCollege,
  useUnsaveCollege
} from "@/hooks/useSaved";
import { cn } from "@/lib/utils";

export function SaveButton({
  collegeId,
  compact = false
}: {
  collegeId: string;
  compact?: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const { data: savedList } = useSavedColleges();
  const saveMutation = useSaveCollege();
  const unsaveMutation = useUnsaveCollege();

  const isSavedInQuery =
    savedList?.data?.some((c) => c.id === collegeId) ?? false;

  // Local state to override query state immediately for snappy optimistic updates
  const [localIsSaved, setLocalIsSaved] = useState<boolean | null>(null);

  // Sync/Reset local state when backend query changes
  useEffect(() => {
    setLocalIsSaved(null);
  }, [isSavedInQuery]);

  const isSaved = localIsSaved !== null ? localIsSaved : isSavedInQuery;
  const isLoading = saveMutation.isPending || unsaveMutation.isPending;

  async function toggleSave() {
    if (status !== "authenticated") {
      toast.error("Please sign in to save colleges");
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`
      );
      return;
    }

    // Toggle local state immediately
    const nextSavedState = !isSaved;
    setLocalIsSaved(nextSavedState);

    try {
      if (isSaved) {
        await unsaveMutation.mutateAsync(collegeId);
        toast.success("Removed from saved");
      } else {
        await saveMutation.mutateAsync(collegeId);
        toast.success("Saved college");
      }
    } catch (error) {
      // Revert local state to query value on failure
      setLocalIsSaved(null);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return (
    <button
      aria-label={isSaved ? "Unsave college" : "Save college"}
      disabled={isLoading}
      onClick={toggleSave}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-60 duration-150 active:scale-90",
        compact
          ? "h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm hover:scale-110"
          : "px-4 py-2 rounded-xl text-sm font-semibold border border-brand-orange text-brand-orange hover:bg-brand-orangeLight"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-150",
          isSaved
            ? "fill-brand-orange text-brand-orange scale-110"
            : "text-gray-600"
        )}
      />
      {!compact && (isSaved ? "Saved" : "Save")}
    </button>
  );
}

"use client";

import {
  FolderPlus,
  Folder,
  Loader2,
  Sparkles,
  Heart,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";

import { CollegeCard } from "@/components/college/CollegeCard";
import {
  useSavedColleges,
  useCollections,
  useCreateCollection,
  useAssignCollection
} from "@/hooks/useSaved";
import { College } from "@/lib/types";
import { cn } from "@/lib/utils";

type SavedCollegeItem = College & { collectionId?: string | null };

export function SavedClient() {
  const { data: session, status } = useSession();
  const { data: savedData, isLoading: savedLoading } = useSavedColleges();
  const { data: collectionsData, isLoading: collectionsLoading } =
    useCollections();

  const createCollection = useCreateCollection();
  const assignCollection = useAssignCollection();

  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colleges = (savedData?.data || []) as SavedCollegeItem[];
  const collections = collectionsData?.data || [];

  async function handleCreateCollection(e: React.FormEvent) {
    e.preventDefault();
    const name = newCollectionName.trim();
    if (!name) return;
    try {
      await createCollection.mutateAsync(name);
      toast.success(`Collection "${name}" created`);
      setNewCollectionName("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create collection"
      );
    }
  }

  async function handleAssign(collegeId: string, collectionId: string) {
    try {
      await assignCollection.mutateAsync({ collectionId, collegeId });
      toast.success("College moved to collection");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to assign college"
      );
    }
  }

  // 1. UNAUTHENTICATED STATE
  if (status === "unauthenticated") {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center select-none flex flex-col items-center">
        <div className="p-5 bg-brand-orange/10 rounded-full text-brand-orange w-16 h-16 flex items-center justify-center mb-6">
          <Heart className="h-8 w-8 text-brand-orange fill-brand-orange animate-pulse" />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
          Sign in to save colleges
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed font-normal">
          Create a free account to save colleges, build shortlists, and track
          your college journey.
        </p>

        {/* Google sign-in button */}
        <div className="mt-8 w-full">
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 hover:bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 transition-all shadow-sm active:scale-98"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15.01.76 12 .76 7.37.76 3.44 3.42 1.54 7.28l3.9 3.02C6.39 7.42 8.97 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.825-.075-1.62-.215-2.385H12v4.515h6.44c-.28 1.465-1.105 2.71-2.35 3.545v2.945h3.8c2.22-2.045 3.6-5.055 3.6-8.62z"
              />
              <path
                fill="#FBBC05"
                d="M5.44 14.7c-.24-.725-.38-1.5-.38-2.3s.14-1.575.38-2.3L1.54 7.08C.55 9.07 0 11.27 0 12.5s.55 3.43 1.54 5.42l3.9-3.22z"
              />
              <path
                fill="#34A853"
                d="M12 23.24c3.24 0 5.97-1.07 7.96-2.915l-3.8-2.945c-1.055.705-2.405 1.135-4.16 1.135-3.03 0-5.61-2.38-6.525-5.59l-3.9 3.02C3.44 19.82 7.37 23.24 12 23.24z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <Link
          href="/colleges"
          className="mt-6 text-xs font-semibold text-brand-orange hover:text-brand-orangeHover"
        >
          Continue browsing →
        </Link>
      </main>
    );
  }

  // 2. LOADING STATE
  if (savedLoading || collectionsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center select-none">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  // Filter colleges based on selected collection
  const filteredColleges = selectedCollectionId
    ? colleges.filter((c) => c.collectionId === selectedCollectionId)
    : colleges;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 select-none">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Saved Shortlists
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
            Organize your target universities and compare backups.
          </p>
        </div>

        {/* Modal Toggle for New Collection */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-md shadow-brand-orange/10"
        >
          <FolderPlus className="h-4.5 w-4.5" />
          <span>+ New Collection</span>
        </button>
      </div>

      {/* Collection Selection Tabs */}
      {collections.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 select-none border-b border-gray-100 pb-4">
          <button
            onClick={() => setSelectedCollectionId(null)}
            className={cn(
              "rounded-full px-4.5 py-1.5 text-xs font-semibold transition-all border",
              selectedCollectionId === null
                ? "bg-brand-orange border-brand-orange text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:text-brand-orange"
            )}
          >
            All Shortlists ({colleges.length})
          </button>

          {collections.map((coll) => {
            const count = colleges.filter(
              (c) => c.collectionId === coll.id
            ).length;
            const isSelected = selectedCollectionId === coll.id;
            return (
              <button
                key={coll.id}
                onClick={() => setSelectedCollectionId(coll.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4.5 py-1.5 text-xs font-semibold transition-all border",
                  isSelected
                    ? "bg-brand-orange border-brand-orange text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:text-brand-orange"
                )}
              >
                <Folder className="h-3.5 w-3.5" />
                <span>
                  {coll.name} ({count})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Colleges List */}
      {filteredColleges.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center select-none">
          <Sparkles className="h-10 w-10 text-brand-orange mb-4 animate-pulse" />
          <h2 className="text-lg font-semibold text-gray-900">
            No saved colleges here
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            {selectedCollectionId
              ? "Assign some of your saved colleges to this collection."
              : "Search and tap the heart icon on colleges to add them to your list."}
          </p>
          <div className="mt-6">
            <Link
              href="/colleges"
              className="inline-flex items-center justify-center rounded-xl bg-brand-orange hover:bg-brand-orangeHover px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-brand-orange/15 active:scale-95"
            >
              Browse colleges
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredColleges.map((college) => (
            <div key={college.id} className="flex flex-col gap-2.5">
              <div className="flex-1">
                <CollegeCard college={college} />
              </div>

              {/* Collection Assign Selector Dropdown */}
              {collections.length > 0 && (
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 text-xs flex items-center justify-between gap-2 shadow-xs select-none">
                  <span className="font-semibold text-gray-400">
                    Move to collection:
                  </span>
                  <select
                    value={college.collectionId || ""}
                    aria-label={`Assign ${college.name} to a collection`}
                    onChange={(e) => handleAssign(college.id, e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1 outline-none text-gray-700 focus:ring-1 focus:ring-brand-orange"
                  >
                    <option value="">None (Unassigned)</option>
                    {collections.map((coll) => (
                      <option key={coll.id} value={coll.id}>
                        {coll.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. NEW COLLECTION DIALOG MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-gray-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 text-base">
              New Collection
            </h3>
            <input
              type="text"
              placeholder="e.g. Dream Colleges, Safety Options"
              className="w-full p-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white text-gray-900"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <div className="flex gap-2 justify-end pt-2 select-none">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-250 text-xs font-semibold rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-xl hover:bg-brand-orangeHover transition-all active:scale-95"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

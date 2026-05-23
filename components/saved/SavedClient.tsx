"use client";

import { FolderPlus, Folder, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { CollegeCard } from "@/components/college/CollegeCard";
import { useSavedColleges, useCollections, useCreateCollection, useAssignCollection } from "@/hooks/useSaved";
import { College } from "@/lib/types";

type SavedCollegeItem = College & { collectionId?: string | null };

export function SavedClient() {
  const { data: savedData, isLoading: savedLoading } = useSavedColleges();
  const { data: collectionsData, isLoading: collectionsLoading } = useCollections();
  const createCollection = useCreateCollection();
  const assignCollection = useAssignCollection();

  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create collection");
    }
  }

  async function handleAssign(collegeId: string, collectionId: string) {
    try {
      await assignCollection.mutateAsync({ collectionId, collegeId });
      toast.success("College moved to collection");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to assign college");
    }
  }

  if (savedLoading || collectionsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter colleges based on selected collection
  const filteredColleges = selectedCollectionId
    ? colleges.filter((c) => c.collectionId === selectedCollectionId)
    : colleges;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved colleges</h1>
          <p className="mt-2 text-slate-655 dark:text-slate-300">
            Keep track of your target universities and organize them into collections.
          </p>
        </div>

        {/* Collection Creation */}
        <form onSubmit={handleCreateCollection} className="flex gap-2">
          <label htmlFor="collection-input" className="sr-only">Collection name</label>
          <input
            id="collection-input"
            type="text"
            placeholder="New collection..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            disabled={createCollection.isPending}
            className="rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none dark:bg-slate-900"
          />
          <button
            type="submit"
            disabled={createCollection.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <FolderPlus className="h-4 w-4" />
            Create
          </button>
        </form>
      </div>

      {/* Collection Filters / Chips */}
      {collections.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCollectionId(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedCollectionId === null
                ? "bg-primary text-white"
                : "border bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200"
            }`}
          >
            All Shortlists ({colleges.length})
          </button>
          {collections.map((coll) => {
            const count = colleges.filter((c) => c.collectionId === coll.id).length;
            return (
              <button
                key={coll.id}
                onClick={() => setSelectedCollectionId(coll.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedCollectionId === coll.id
                    ? "bg-primary text-white"
                    : "border bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200"
                }`}
              >
                <Folder className="h-3.5 w-3.5" />
                {coll.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* College Grid */}
      {filteredColleges.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center dark:bg-slate-950">
          <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-4 text-xl font-semibold">No saved colleges here</h2>
          <p className="mt-2 text-slate-655 dark:text-slate-300">
            {selectedCollectionId
              ? "Assign some of your saved colleges to this collection."
              : "Search and tap the heart icon on colleges to add them to your list."}
          </p>
          <Link href="/colleges" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 font-semibold text-white">
            Browse colleges
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredColleges.map((college) => (
            <div key={college.id} className="flex flex-col gap-2">
              <div className="flex-1">
                <CollegeCard college={college} />
              </div>
              {/* Collection Assign Selector */}
              {collections.length > 0 && (
                <div className="rounded-b-lg border-x border-b bg-slate-50 p-2 text-xs flex items-center justify-between gap-2 dark:bg-slate-900/60">
                  <span className="font-medium text-slate-500">Collection:</span>
                  <select
                    value={college.collectionId || ""}
                    aria-label={`Assign ${college.name} to a collection`}
                    onChange={(e) => handleAssign(college.id, e.target.value)}
                    className="rounded border bg-white px-2 py-1 outline-none dark:bg-slate-950"
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
    </main>
  );
}

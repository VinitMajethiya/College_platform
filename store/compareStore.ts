"use client";

import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompareItem = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
};

type CompareStore = {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const items = get().items;
        if (items.some((existing) => existing.id === item.id)) {
          toast.info("College is already in compare");
          return;
        }
        if (items.length >= 3) {
          toast.error("You can compare up to 3 colleges");
          return;
        }
        set({ items: [...items, item] });
        toast.success("Added to compare");
      },
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((item) => item.id === id)
    }),
    {
      name: "collegecompass-compare"
    }
  )
);

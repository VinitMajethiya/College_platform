import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCompareStore } from "@/store/compareStore";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

const mockItem1 = {
  id: "col-1",
  slug: "college-one",
  name: "College One",
  city: "City One",
  state: "State One"
};

const mockItem2 = {
  id: "col-2",
  slug: "college-two",
  name: "College Two",
  city: "City Two",
  state: "State Two"
};

const mockItem3 = {
  id: "col-3",
  slug: "college-three",
  name: "College Three",
  city: "City Three",
  state: "State Three"
};

const mockItem4 = {
  id: "col-4",
  slug: "college-four",
  name: "College Four",
  city: "City Four",
  state: "State Four"
};

describe("useCompareStore", () => {
  beforeEach(() => {
    useCompareStore.setState({ items: [] });
    vi.clearAllMocks();
  });

  it("should initialize with empty items", () => {
    expect(useCompareStore.getState().items).toEqual([]);
  });

  it("should add a new item and toast success", () => {
    useCompareStore.getState().add(mockItem1);
    expect(useCompareStore.getState().items).toEqual([mockItem1]);
    expect(toast.success).toHaveBeenCalledWith("Added to compare");
  });

  it("should prevent duplicate additions and toast info", () => {
    useCompareStore.getState().add(mockItem1);
    useCompareStore.getState().add(mockItem1);
    expect(useCompareStore.getState().items).toEqual([mockItem1]);
    expect(toast.info).toHaveBeenCalledWith("College is already in compare");
  });

  it("should restrict additions to maximum 3 items", () => {
    useCompareStore.getState().add(mockItem1);
    useCompareStore.getState().add(mockItem2);
    useCompareStore.getState().add(mockItem3);
    useCompareStore.getState().add(mockItem4);

    expect(useCompareStore.getState().items).toEqual([
      mockItem1,
      mockItem2,
      mockItem3
    ]);
    expect(toast.error).toHaveBeenCalledWith(
      "You can compare up to 3 colleges"
    );
  });

  it("should remove item by id", () => {
    useCompareStore.getState().add(mockItem1);
    useCompareStore.getState().add(mockItem2);
    useCompareStore.getState().remove(mockItem1.id);

    expect(useCompareStore.getState().items).toEqual([mockItem2]);
  });

  it("should clear all items", () => {
    useCompareStore.getState().add(mockItem1);
    useCompareStore.getState().clear();

    expect(useCompareStore.getState().items).toEqual([]);
  });

  it("should return true for has() when item is present", () => {
    useCompareStore.getState().add(mockItem1);
    expect(useCompareStore.getState().has(mockItem1.id)).toBe(true);
    expect(useCompareStore.getState().has(mockItem2.id)).toBe(false);
  });
});

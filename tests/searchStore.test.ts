import { beforeEach, describe, expect, it } from "vitest";

import { useSearchStore } from "@/store/searchStore";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.setState({ isOpen: false });
  });

  it("should initialize with isOpen set to false", () => {
    expect(useSearchStore.getState().isOpen).toBe(false);
  });

  it("should open search when calling open()", () => {
    useSearchStore.getState().open();
    expect(useSearchStore.getState().isOpen).toBe(true);
  });

  it("should close search when calling close()", () => {
    useSearchStore.setState({ isOpen: true });
    useSearchStore.getState().close();
    expect(useSearchStore.getState().isOpen).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import { cn, formatCurrencyINR, formatFeeRange, slugify } from "@/lib/utils";

describe("cn", () => {
  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "bg-blue-500")).toBe("px-2 py-1 bg-blue-500");
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("formatCurrencyINR", () => {
  it("formats large numbers as Lakhs with L suffix", () => {
    expect(formatCurrencyINR(100000)).toBe("₹1L");
    expect(formatCurrencyINR(250000)).toBe("₹2.5L");
    expect(formatCurrencyINR(1200000)).toBe("₹12L");
  });

  it("formats smaller numbers using standard Indian currency notation", () => {
    const result = formatCurrencyINR(50000);
    // Use loose containing assertions as different Node versions format currency characters slightly differently
    expect(result).toContain("50");
    expect(result).toContain("000");
  });
});

describe("formatFeeRange", () => {
  it("formats single fees if min and max are equal", () => {
    expect(formatFeeRange(200000, 200000)).toBe("₹2L");
  });

  it("formats range of fees if min and max differ", () => {
    expect(formatFeeRange(100000, 300000)).toBe("₹1L - ₹3L");
  });
});

describe("slugify", () => {
  it("converts spaces and special characters to hyphens and lowercases", () => {
    expect(slugify("IIT Bombay")).toBe("iit-bombay");
    expect(slugify("All India Institute of Medical Sciences - Delhi")).toBe(
      "all-india-institute-of-medical-sciences-delhi"
    );
    expect(slugify("   space  around   ")).toBe("space-around");
  });
});

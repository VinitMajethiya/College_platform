export type StreamType =
  | "engineering"
  | "medical"
  | "management"
  | "law"
  | "arts"
  | "science"
  | "commerce"
  | "architecture"
  | "pharmacy";

export const STREAM_GRADIENTS: Record<string, string> = {
  engineering: "from-[#1a1a2e] to-[#0f3460]",
  medical: "from-[#064e3b] to-[#065f46]",
  management: "from-[#1e1b4b] to-[#312e81]",
  law: "from-[#1c1917] to-[#292524]",
  arts: "from-[#4a1d96] to-[#6d28d9]",
  "arts & humanities": "from-[#4a1d96] to-[#6d28d9]",
  science: "from-[#075985] to-[#0369a1]",
  commerce: "from-[#115e59] to-[#0f766e]",
  architecture: "from-[#854d0e] to-[#a16207]",
  pharmacy: "from-[#9d174d] to-[#be185d]"
};

export function getStreamGradient(stream: string): string {
  const normalized = stream.toLowerCase().trim();
  return STREAM_GRADIENTS[normalized] || "from-[#1a1a2e] to-[#16213e]";
}

type LeadInput = {
  budget?: string | null;
  platforms?: string | null;
  message: string;
  source?: string;
};

export function scoreLead(input: LeadInput): { score: number; tier: "hot" | "maybe" | "pass" } {
  let score = 35;
  const text = `${input.budget || ""} ${input.platforms || ""} ${input.message}`.toLowerCase();

  if (input.source === "instagram") score += 5;
  if (input.source === "web") score += 8;

  const budgetNums = (input.budget || "").match(/\d+/g)?.map(Number) || [];
  const maxBudget = budgetNums.length ? Math.max(...budgetNums) : 0;
  if (maxBudget >= 150) score += 30;
  else if (maxBudget >= 100) score += 22;
  else if (maxBudget >= 60) score += 12;
  else if (/paid|budget|rate|sponsor/i.test(input.budget || "")) score += 6;

  if (/tiktok|instagram|youtube|amazon|reel|ugc/i.test(input.platforms || text)) score += 10;
  if (/how-?to|unboxing|review|demo/i.test(text)) score += 8;
  if (/asap|urgent|this week|deadline/i.test(text)) score += 6;
  if (input.message.length > 120) score += 5;
  if (input.message.length < 40) score -= 10;
  if (/free|gifted only|exposure|no budget/i.test(text)) score -= 25;

  score = Math.max(0, Math.min(100, score));
  const tier = score >= 70 ? "hot" : score >= 45 ? "maybe" : "pass";
  return { score, tier };
}

import type { SideHustle, FinderAnswer } from "../types/side-hustle";

// ─── Cost ordering ──────────────────────────────────────────────────────────
const COST_ORDER: Record<string, number> = {
  "$0": 0,
  "Under $50": 1,
  "$50–$200": 2,
  "$200–$500": 3,
  "$500+": 4,
};

const INCOME_ORDER: Record<string, number> = {
  "$100–$500/mo": 1,
  "$500–$2,000/mo": 2,
  "$1,000–$4,000/mo": 3,
  "$2,000–$5,000/mo": 4,
  "$5,000+/mo": 5,
};

// ─── Matching algorithm ────────────────────────────────────────────────────
export function scoreHustle(hustle: SideHustle, answers: FinderAnswer): number {
  let score = 0;

  // Remote / local match
  if (answers.remote === "remote" && hustle.remote) score += 20;
  if (answers.remote === "local" && hustle.localAvailable) score += 20;
  if (answers.remote === "both") score += 10;

  // Experience level
  if (answers.experienceLevel === "beginner" && hustle.beginnerFriendly) score += 25;
  if (answers.experienceLevel === "intermediate" && hustle.difficulty !== "Advanced") score += 20;
  if (answers.experienceLevel === "advanced") score += 15;

  // Startup budget
  const costRank = COST_ORDER[hustle.startupCost] ?? 5;
  if (answers.startupBudget === "zero" && costRank === 0) score += 20;
  if (answers.startupBudget === "under50" && costRank <= 1) score += 15;
  if (answers.startupBudget === "under200" && costRank <= 2) score += 10;
  if (answers.startupBudget === "under500" && costRank <= 3) score += 5;
  if (answers.startupBudget === "any") score += 5;

  // Quick income
  if (answers.needsQuickIncome) {
    const t = hustle.timeToFirstIncome?.toLowerCase() ?? "";
    if (t.includes("day") || t.includes("1–2 week")) score += 20;
    else if (t.includes("2–4 week")) score += 10;
    else if (t.includes("month")) score -= 5;
  }

  // Skills overlap
  if (answers.skills.length > 0) {
    const hustleSkillsLower = hustle.skills.map((s) => s.toLowerCase());
    const tagsLower = hustle.tags.map((t) => t.toLowerCase());
    const userSkillsLower = answers.skills.map((s) => s.toLowerCase());
    for (const skill of userSkillsLower) {
      if (hustleSkillsLower.some((s) => s.includes(skill) || skill.includes(s))) score += 10;
      if (tagsLower.some((t) => t.includes(skill) || skill.includes(t))) score += 5;
    }
  }

  // Income goal
  const incomeRank = INCOME_ORDER[hustle.incomePotential] ?? 0;
  if (answers.incomeGoal === "extra" && incomeRank >= 1) score += 5;
  if (answers.incomeGoal === "parttime" && incomeRank >= 2) score += 10;
  if (answers.incomeGoal === "fulltime" && incomeRank >= 3) score += 15;
  if (answers.incomeGoal === "replace" && incomeRank >= 4) score += 20;

  return score;
}

export function getRecommendations(
  hustles: SideHustle[],
  answers: FinderAnswer,
  limit = 6
): SideHustle[] {
  return hustles
    .map((h) => ({ hustle: h, score: scoreHustle(h, answers) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ hustle }) => hustle);
}

// ─── Related hustles ────────────────────────────────────────────────────────
export function getRelated(hustle: SideHustle, all: SideHustle[], limit = 4): SideHustle[] {
  return all
    .filter((h) => h.slug !== hustle.slug)
    .map((h) => {
      let score = 0;
      if (h.category === hustle.category) score += 30;
      const sharedTags = h.tags.filter((t) => hustle.tags.includes(t)).length;
      score += sharedTags * 10;
      const sharedSkills = h.skills.filter((s) => hustle.skills.includes(s)).length;
      score += sharedSkills * 5;
      if (h.remote === hustle.remote) score += 10;
      return { hustle: h, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ hustle }) => hustle);
}

// ─── Categories ─────────────────────────────────────────────────────────────
export function getCategories(hustles: SideHustle[]): string[] {
  return [...new Set(hustles.map((h) => h.category))].sort();
}

// ─── Filter hustles ─────────────────────────────────────────────────────────
export interface FilterOptions {
  remote?: boolean;
  beginnerFriendly?: boolean;
  maxStartupCost?: string;
  category?: string;
  weeklyPay?: boolean;
  query?: string;
}

export function filterHustles(hustles: SideHustle[], opts: FilterOptions): SideHustle[] {
  return hustles.filter((h) => {
    if (opts.remote !== undefined && h.remote !== opts.remote) return false;
    if (opts.beginnerFriendly && !h.beginnerFriendly) return false;
    if (opts.category && h.category !== opts.category) return false;
    if (opts.weeklyPay && !h.weeklyPay) return false;
    if (opts.maxStartupCost !== undefined) {
      const maxRank = COST_ORDER[opts.maxStartupCost] ?? 99;
      const hRank = COST_ORDER[h.startupCost] ?? 99;
      if (hRank > maxRank) return false;
    }
    if (opts.query) {
      const q = opts.query.toLowerCase();
      const searchable = [
        h.name,
        h.category,
        h.description,
        ...h.skills,
        ...h.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

// ─── Comparison pairs ────────────────────────────────────────────────────────
export function generateComparisonPairs(
  hustles: SideHustle[],
  maxPairs = 100
): Array<[SideHustle, SideHustle]> {
  const pairs: Array<[SideHustle, SideHustle]> = [];
  for (let i = 0; i < hustles.length && pairs.length < maxPairs; i++) {
    for (let j = i + 1; j < hustles.length && pairs.length < maxPairs; j++) {
      const a = hustles[i];
      const b = hustles[j];
      // Prefer same-category or related-tag pairs
      if (a.category === b.category || a.tags.some((t) => b.tags.includes(t))) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs.slice(0, maxPairs);
}

// ─── Diff key ────────────────────────────────────────────────────────────────
export function buildComparisonSlug(a: SideHustle, b: SideHustle): string {
  return `${a.slug}-vs-${b.slug}`;
}

// ─── Income rank helper ──────────────────────────────────────────────────────
export function incomeRank(potential: string): number {
  return INCOME_ORDER[potential] ?? 0;
}

export function costRank(cost: string): number {
  return COST_ORDER[cost] ?? 99;
}

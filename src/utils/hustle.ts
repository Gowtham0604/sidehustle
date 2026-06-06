import type { SideHustle, FinderAnswer, ScoredHustle } from "../types/side-hustle";

// ─── Cost / income ordering ──────────────────────────────────────────────────
export const COST_ORDER: Record<string, number> = {
  "$0": 0,
  "Under $50": 1,
  "$50–$200": 2,
  "$200–$500": 3,
  "$500+": 4,
};

export const INCOME_ORDER: Record<string, number> = {
  "$100–$500/mo": 1,
  "$500–$2,000/mo": 2,
  "$1,000–$4,000/mo": 3,
  "$2,000–$5,000/mo": 4,
  "$5,000+/mo": 5,
};

// Maximum possible score — used to normalise to 0–100%
// Remote(20) + Experience(25) + Budget(20) + QuickIncome(20) + Skills(30) + IncomeGoal(20) + BeginnerBonus(10) = 145
const MAX_SCORE = 145;

// Minimum raw score a hustle must achieve to appear in results.
// This prevents completely irrelevant hustles from showing up.
// A hustle with no skill match and weak criteria fits should score < 25.
const MIN_SCORE_THRESHOLD = 20;

// ─── Skill synonym mapping ───────────────────────────────────────────────────
// Each entry is [synonym, requireWordBoundary]
// requireWordBoundary=true means we match whole words only (avoids false positives
// like "app" matching "appeal", "sql" matching "casually", "web" matching "weber")
const SKILL_MAP: Record<string, Array<{ term: string; boundary: boolean }>> = {
  writing: [
    { term: "writing", boundary: true },
    { term: "copywriting", boundary: true },
    { term: "copywriter", boundary: true },
    { term: "content writing", boundary: false },
    { term: "blogging", boundary: true },
    { term: "ghostwriting", boundary: true },
    { term: "technical writing", boundary: false },
    { term: "proofreading", boundary: true },
    { term: "editing", boundary: true },
    { term: "journalism", boundary: true },
    { term: "newsletter", boundary: true },
  ],
  design: [
    { term: "design", boundary: true },
    { term: "graphic", boundary: true },
    { term: "figma", boundary: true },
    { term: "canva", boundary: true },
    { term: "illustrator", boundary: true },
    { term: "photoshop", boundary: true },
    { term: "branding", boundary: true },
    { term: "ui/ux", boundary: false },
    { term: "logo", boundary: true },
    { term: "typography", boundary: true },
    { term: "illustration", boundary: true },
  ],
  coding: [
    { term: "coding", boundary: true },
    { term: "developer", boundary: true },
    { term: "javascript", boundary: true },
    { term: "python", boundary: true },
    { term: "react", boundary: true },
    { term: "html", boundary: true },
    { term: "css", boundary: true },
    { term: "web development", boundary: false },
    { term: "software", boundary: true },
    { term: "mobile app", boundary: false },
    { term: "backend", boundary: true },
    { term: "frontend", boundary: true },
    { term: "sql", boundary: true },
    { term: "api development", boundary: false },
    { term: "typescript", boundary: true },
    { term: "node.js", boundary: false },
    { term: "next.js", boundary: false },
  ],
  marketing: [
    { term: "marketing", boundary: true },
    { term: "seo", boundary: true },
    { term: "advertising", boundary: true },
    { term: "ppc", boundary: true },
    { term: "growth hacking", boundary: false },
    { term: "email marketing", boundary: false },
    { term: "analytics", boundary: true },
    { term: "lead generation", boundary: false },
    { term: "content marketing", boundary: false },
  ],
  teaching: [
    { term: "teaching", boundary: true },
    { term: "tutoring", boundary: true },
    { term: "coaching", boundary: true },
    { term: "training", boundary: true },
    { term: "education", boundary: true },
    { term: "curriculum", boundary: true },
    { term: "instructor", boundary: true },
    { term: "mentor", boundary: true },
  ],
  video: [
    { term: "video editing", boundary: false },
    { term: "youtube", boundary: true },
    { term: "reels", boundary: true },
    { term: "filming", boundary: true },
    { term: "video production", boundary: false },
    { term: "after effects", boundary: false },
    { term: "premiere", boundary: true },
    { term: "animation", boundary: true },
    { term: "motion graphics", boundary: false },
  ],
  photography: [
    { term: "photography", boundary: true },
    { term: "photographer", boundary: true },
    { term: "lightroom", boundary: true },
    { term: "portrait", boundary: true },
    { term: "product photography", boundary: false },
    { term: "real estate photos", boundary: false },
  ],
  "social media": [
    { term: "social media", boundary: false },
    { term: "instagram", boundary: true },
    { term: "tiktok", boundary: true },
    { term: "linkedin", boundary: true },
    { term: "facebook", boundary: true },
    { term: "content creation", boundary: false },
    { term: "influencer", boundary: true },
  ],
  "excel/spreadsheets": [
    { term: "excel", boundary: true },
    { term: "spreadsheet", boundary: true },
    { term: "google sheets", boundary: false },
    { term: "data analysis", boundary: false },
    { term: "reporting", boundary: true },
    { term: "pivot", boundary: true },
  ],
  "customer service": [
    { term: "customer service", boundary: false },
    { term: "customer support", boundary: false },
    { term: "helpdesk", boundary: true },
    { term: "chat support", boundary: false },
    { term: "call center", boundary: false },
  ],
  sales: [
    { term: "sales", boundary: true },
    { term: "closing deals", boundary: false },
    { term: "outreach", boundary: true },
    { term: "prospecting", boundary: true },
    { term: "crm", boundary: true },
    { term: "cold email", boundary: false },
    { term: "lead generation", boundary: false },
  ],
  "finance/accounting": [
    { term: "finance", boundary: true },
    { term: "accounting", boundary: true },
    { term: "bookkeeping", boundary: true },
    { term: "quickbooks", boundary: true },
    { term: "tax", boundary: true },
    { term: "cpa", boundary: true },
    { term: "financial", boundary: true },
  ],
  "physical labor": [
    { term: "handyman", boundary: true },
    { term: "cleaning", boundary: true },
    { term: "moving", boundary: true },
    { term: "delivery", boundary: true },
    { term: "driving", boundary: true },
    { term: "landscaping", boundary: true },
    { term: "outdoor services", boundary: false },
    { term: "lawn", boundary: true },
    { term: "physical labor", boundary: false },
  ],
  cooking: [
    { term: "cooking", boundary: true },
    { term: "baking", boundary: true },
    { term: "food", boundary: true },
    { term: "catering", boundary: true },
    { term: "meal prep", boundary: false },
    { term: "chef", boundary: true },
    { term: "recipes", boundary: true },
    { term: "culinary", boundary: true },
  ],
  languages: [
    { term: "translation", boundary: true },
    { term: "bilingual", boundary: true },
    { term: "interpreting", boundary: true },
    { term: "spanish", boundary: true },
    { term: "french", boundary: true },
    { term: "mandarin", boundary: true },
    { term: "language", boundary: true },
  ],
};

// Match a term against text using whole-word boundaries when required
function termMatches(text: string, term: string, boundary: boolean): boolean {
  if (!boundary) return text.includes(term);
  // Word-boundary check: term must be surrounded by non-word chars or string edges
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "i");
  return re.test(text);
}

function skillsMatch(hustle: SideHustle, userSkills: string[]): { points: number; reasons: string[] } {
  if (userSkills.length === 0) return { points: 0, reasons: [] };

  // Build separate searchable text for skills/tags (more reliable) vs description (looser)
  const skillTagText = [
    ...hustle.skills.map((s) => s.toLowerCase()),
    ...hustle.tags.map((t) => t.toLowerCase()),
    hustle.category.toLowerCase(),
  ].join(" ");
  const descText = hustle.description.toLowerCase();

  let points = 0;
  const reasons: string[] = [];

  for (const userSkill of userSkills) {
    const synonyms = SKILL_MAP[userSkill] ?? [{ term: userSkill, boundary: true }];
    // First check skills/tags/category (high confidence), then description (lower confidence)
    const matchedInSkillTag = synonyms.some(({ term, boundary }) => termMatches(skillTagText, term, boundary));
    const matchedInDesc = !matchedInSkillTag && synonyms.some(({ term, boundary }) => termMatches(descText, term, true)); // always boundary in desc

    if (matchedInSkillTag) {
      points += 8; // stronger signal from skills/tags
      reasons.push(`matches your ${userSkill} skills`);
    } else if (matchedInDesc) {
      points += 4; // weaker signal from description
      reasons.push(`relates to your ${userSkill} skills`);
    }
  }

  return { points: Math.min(points, 30), reasons };
}

// ─── Core scoring ────────────────────────────────────────────────────────────
export function scoreHustle(
  hustle: SideHustle,
  answers: FinderAnswer
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // ── Remote / local preference (20 pts) ──
  if (answers.remote === "remote") {
    if (hustle.remote) {
      score += 20;
      reasons.push("fully remote — work from anywhere");
    }
  } else if (answers.remote === "local") {
    if (hustle.localAvailable) {
      score += 20;
      reasons.push("available in your local area");
    } else if (hustle.remote) {
      score += 5; // partial credit
    }
  } else {
    // both
    score += 10;
  }

  // ── Experience match (25 pts) ──
  if (answers.experienceLevel === "beginner") {
    if (hustle.beginnerFriendly) {
      score += 25;
      reasons.push("beginner-friendly — no experience required");
    } else if (hustle.difficulty === "Intermediate") {
      score += 8;
    }
  } else if (answers.experienceLevel === "intermediate") {
    if (hustle.difficulty === "Intermediate") {
      score += 25;
      reasons.push("matches your intermediate skill level");
    } else if (hustle.difficulty === "Beginner") {
      score += 15;
      reasons.push("easy to pick up with your experience");
    } else {
      score += 8;
    }
  } else {
    // advanced
    if (hustle.difficulty === "Advanced") {
      score += 25;
      reasons.push("matches your advanced experience level");
    } else {
      score += 15;
    }
  }

  // ── Startup budget (20 pts) ──
  const costRankVal = COST_ORDER[hustle.startupCost] ?? 5;
  if (answers.startupBudget === "zero") {
    if (costRankVal === 0) {
      score += 20;
      reasons.push("free to start — $0 required");
    } else if (costRankVal === 1) {
      score += 8;
    }
  } else if (answers.startupBudget === "under50") {
    if (costRankVal <= 1) {
      score += 20;
      reasons.push("fits your budget — low startup cost");
    } else if (costRankVal === 2) {
      score += 10;
    }
  } else if (answers.startupBudget === "under200") {
    if (costRankVal <= 2) {
      score += 20;
      reasons.push("startup cost is within your budget");
    } else if (costRankVal === 3) {
      score += 10;
    }
  } else if (answers.startupBudget === "under500") {
    if (costRankVal <= 3) score += 20;
    else score += 10;
  } else {
    // any
    score += 10;
  }

  // ── Quick income need (20 pts) ──
  if (answers.needsQuickIncome) {
    const t = (hustle.timeToFirstIncome ?? "").toLowerCase();
    if (t.includes("day") || t.includes("3–7") || t.includes("1–2 week")) {
      score += 20;
      reasons.push("fast income — can earn within 1–2 weeks");
    } else if (t.includes("2–4 week") || t.includes("2–3 week")) {
      score += 10;
      reasons.push("relatively quick income — 2–4 weeks to first pay");
    } else if (t.includes("month")) {
      score -= 5;
    }
  } else {
    score += 5; // small bonus for not needing quick income (more options)
  }

  // ── Skills overlap (30 pts) ──
  const { points: skillPts, reasons: skillReasons } = skillsMatch(hustle, answers.skills);
  score += skillPts;
  reasons.push(...skillReasons);

  // ── Income goal (20 pts) ──
  const incomeRankVal = INCOME_ORDER[hustle.incomePotential] ?? 0;
  if (answers.incomeGoal === "extra") {
    if (incomeRankVal >= 1) {
      score += 10;
      reasons.push(`income potential fits your goal (${hustle.incomePotential})`);
    }
    if (incomeRankVal >= 3) score += 5; // bonus for overdelivering
  } else if (answers.incomeGoal === "parttime") {
    if (incomeRankVal >= 2) {
      score += 15;
      reasons.push(`solid income potential — ${hustle.incomePotential}`);
    } else if (incomeRankVal === 1) {
      score += 5;
    }
  } else if (answers.incomeGoal === "fulltime") {
    if (incomeRankVal >= 3) {
      score += 20;
      reasons.push(`high earning potential — ${hustle.incomePotential}`);
    } else if (incomeRankVal === 2) {
      score += 10;
    }
  } else {
    // replace
    if (incomeRankVal >= 4) {
      score += 20;
      reasons.push(`top earning potential — ${hustle.incomePotential}`);
    } else if (incomeRankVal === 3) {
      score += 10;
    }
  }

  // ── Beginner bonus ──
  if (answers.experienceLevel === "beginner" && hustle.beginnerFriendly) {
    score += 10;
  }

  return { score: Math.max(0, score), reasons };
}

// ─── Get scored recommendations ──────────────────────────────────────────────
export function getScoredRecommendations(
  hustles: SideHustle[],
  answers: FinderAnswer,
  limit = 10
): ScoredHustle[] {
  return hustles
    .map((hustle) => {
      const { score, reasons } = scoreHustle(hustle, answers);
      const matchPercent = Math.min(100, Math.round((score / MAX_SCORE) * 100));

      // Confidence tier
      let confidence: ScoredHustle["confidence"];
      if (matchPercent >= 70) confidence = "Strong Match";
      else if (matchPercent >= 45) confidence = "Good Match";
      else confidence = "Decent Match";

      // Deduplicate reasons and cap at 3
      const uniqueReasons = [...new Set(reasons)].slice(0, 3);

      return {
        hustle,
        score,
        matchPercent,
        whyMatch: uniqueReasons,
        difficulty: hustle.difficulty,
        confidence,
      } satisfies ScoredHustle;
    })
    .filter(({ score }) => score >= MIN_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Legacy compat — returns plain SideHustle[]
export function getRecommendations(
  hustles: SideHustle[],
  answers: FinderAnswer,
  limit = 6
): SideHustle[] {
  return getScoredRecommendations(hustles, answers, limit).map((r) => r.hustle);
}

// ─── Generate AI-style summary text ─────────────────────────────────────────
export function generateReportSummary(answers: FinderAnswer, results: ScoredHustle[]): string {
  const hoursLabel: Record<FinderAnswer["hoursPerWeek"], string> = {
    under5: "under 5 hours",
    "5to10": "5–10 hours",
    "10to20": "10–20 hours",
    "20plus": "20+ hours",
  };
  const goalLabel: Record<FinderAnswer["incomeGoal"], string> = {
    extra: "$100–$500/month",
    parttime: "$500–$2,000/month",
    fulltime: "$2,000–$5,000/month",
    replace: "$5,000+/month",
  };

  const topNames = results
    .slice(0, 3)
    .map((r) => r.hustle.name)
    .join(", ");

  const remote =
    answers.remote === "remote"
      ? "remote work"
      : answers.remote === "local"
      ? "local opportunities"
      : "both remote and local work";

  const quick = answers.needsQuickIncome ? ", and need income quickly" : "";
  const skillsNote =
    answers.skills.length > 0
      ? ` Your skills in ${answers.skills.slice(0, 3).join(", ")} were factored in.`
      : "";

  return `You have ${hoursLabel[answers.hoursPerWeek]} per week, prefer ${remote}, have ${answers.experienceLevel}-level experience${quick}. Your target is ${goalLabel[answers.incomeGoal]}.${skillsNote} Based on these factors, <strong>${topNames}</strong> are your strongest matches.`;
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
      const searchable = [h.name, h.category, h.description, ...h.skills, ...h.tags]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

// ─── Comparison helpers ──────────────────────────────────────────────────────
export function generateComparisonPairs(
  hustles: SideHustle[],
  maxPairs = 100
): Array<[SideHustle, SideHustle]> {
  const pairs: Array<[SideHustle, SideHustle]> = [];
  for (let i = 0; i < hustles.length && pairs.length < maxPairs; i++) {
    for (let j = i + 1; j < hustles.length && pairs.length < maxPairs; j++) {
      const a = hustles[i];
      const b = hustles[j];
      if (a.category === b.category || a.tags.some((t) => b.tags.includes(t))) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs.slice(0, maxPairs);
}

export function buildComparisonSlug(a: SideHustle, b: SideHustle): string {
  return `${a.slug}-vs-${b.slug}`;
}

export function incomeRank(potential: string): number {
  return INCOME_ORDER[potential] ?? 0;
}

export function costRank(cost: string): number {
  return COST_ORDER[cost] ?? 99;
}

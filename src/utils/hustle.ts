import type { SideHustle, FinderAnswer, ScoredHustle } from "../types/side-hustle";

// ─── Roadmap data ────────────────────────────────────────────────────────────
export interface RoadmapStep {
  week: string;
  title: string;
  tasks: string[];
}

export function getRoadmap(hustle: SideHustle): RoadmapStep[] {
  const isRemote = hustle.remote;
  const isBeginner = hustle.beginnerFriendly;
  const cost = hustle.startupCost;

  const setupTask = cost === "$0"
    ? "Create free profiles on relevant platforms (Upwork, Fiverr, or LinkedIn)"
    : `Invest in required startup tools (~${cost})`;

  return [
    {
      week: "Week 1",
      title: "Research & Setup",
      tasks: [
        `Research the ${hustle.name} market — check competitors and pricing`,
        setupTask,
        "Define your target client or customer profile",
        "Set your starting rate (start lower to build reviews, raise after 5 clients)",
      ],
    },
    {
      week: "Week 2",
      title: "First Clients / First Gig",
      tasks: [
        isBeginner
          ? "Reach out to 10 warm contacts who might need your service"
          : "Post samples of work in relevant communities (Reddit, LinkedIn, X)",
        isRemote
          ? "Apply to 3–5 gigs on Upwork, Fiverr, or relevant job boards"
          : "Post on Nextdoor and local Facebook groups",
        "Do one free or discounted job in exchange for a testimonial",
        `Track your hours and earnings from day one`,
      ],
    },
    {
      week: "Week 3–4",
      title: "First Earnings",
      tasks: [
        "Deliver excellent work and ask satisfied clients for a review or referral",
        "Optimize your profile or listing based on what's getting clicks",
        "Set up a simple invoice process (Wave, PayPal, or Google Docs template)",
        `Aim to hit ${hustle.timeToFirstIncome.includes("week") ? "your first payment" : "your first milestone"} by end of month`,
      ],
    },
    {
      week: "Month 2–3",
      title: "Build Momentum",
      tasks: [
        "Raise your rate by 20–30% once you have 3+ positive reviews",
        "Focus on 1–2 client types that pay the best and are easiest to retain",
        "Develop a simple portfolio or case study doc to share with prospects",
        `Target hitting ${hustle.incomePotential.split("–")[0]}/mo within 90 days`,
      ],
    },
    {
      week: "Month 4+",
      title: "Scale",
      tasks: [
        "Add a second acquisition channel (referrals, content, or a new platform)",
        "Consider niching down — specialists earn 2–3× generalists",
        "Systematize repeatable tasks to reduce time-per-project",
        `Realistic ceiling: ${hustle.incomePotential} with consistent effort`,
      ],
    },
  ];
}

// ─── Best for / Not ideal for data ──────────────────────────────────────────
export function getBestFor(hustle: SideHustle): string[] {
  const result: string[] = [];
  if (hustle.beginnerFriendly) result.push("Complete beginners with no prior experience");
  if (hustle.remote) result.push("People who want to work from home or anywhere");
  if (hustle.startupCost === "$0") result.push("Anyone who wants to start with zero investment");
  if (hustle.weeklyPay) result.push("People who need income quickly or on a weekly basis");
  if (hustle.difficulty === "Advanced") result.push("Experienced professionals looking to monetize expertise");
  if (hustle.tags.includes("passive")) result.push("People building long-term passive income streams");
  if ((hustle.hoursPerWeek ?? "").startsWith("5") || (hustle.hoursPerWeek ?? "").startsWith("1–")) {
    result.push("Full-time employees with limited hours (5–10 hrs/week)");
  }
  const income = hustle.incomePotential;
  if (income === "$2,000–$5,000/mo" || income === "$5,000+/mo") {
    result.push("People looking to replace or supplement a full-time income");
  }
  if (hustle.localAvailable) result.push("People who prefer or need to work locally");
  return result.length > 0 ? result : ["People looking for a flexible income opportunity"];
}

export function getNotIdealFor(hustle: SideHustle): string[] {
  const result: string[] = [];
  if (!hustle.beginnerFriendly) result.push("Complete beginners — some experience is required");
  if (!hustle.remote) result.push("People who need a fully remote, location-independent job");
  if (hustle.startupCost !== "$0" && hustle.startupCost !== "Under $50") {
    result.push("Anyone with zero budget to invest upfront");
  }
  if (hustle.difficulty === "Advanced") result.push("Those looking for a quick, easy side income");
  const t = (hustle.timeToFirstIncome ?? "").toLowerCase();
  if (t.includes("month") && !t.includes("2–4")) {
    result.push("People who need income within the next 1–2 weeks");
  }
  if (hustle.tags.includes("local") && !hustle.remote) {
    result.push("People in rural areas or small towns with limited local demand");
  }
  const income = hustle.incomePotential;
  if (income === "$100–$500/mo") {
    result.push("People looking to replace a full-time income — ceiling is limited");
  }
  return result.length > 0 ? result : ["Anyone expecting overnight results — this takes consistent effort"];
}

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
// Skills(60) + Remote(20) + Experience(25) + Budget(20) + QuickIncome(20) + Risk(20) + IncomeGoal(20) + BeginnerBonus(10) = 195
const MAX_SCORE = 195;

// Minimum raw score a hustle must achieve to appear in results.
// This prevents completely irrelevant hustles from showing up.
const MIN_SCORE_THRESHOLD = 20;

// When the user has selected skills, hustles with ZERO skill overlap are excluded entirely.
// This ensures results always reflect the profession the user actually chose.
const REQUIRE_SKILL_MATCH_WHEN_SKILLS_SELECTED = true;

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

function skillsMatch(hustle: SideHustle, userSkills: string[]): { points: number; reasons: string[]; hasAnyMatch: boolean } {
  if (userSkills.length === 0) return { points: 0, reasons: [], hasAnyMatch: false };

  // Build separate searchable text for skills/tags (more reliable) vs description (looser)
  const skillTagText = [
    ...hustle.skills.map((s) => s.toLowerCase()),
    ...hustle.tags.map((t) => t.toLowerCase()),
    hustle.category.toLowerCase(),
  ].join(" ");
  const descText = hustle.description.toLowerCase();

  let points = 0;
  const reasons: string[] = [];
  let hasAnyMatch = false;

  for (const userSkill of userSkills) {
    const synonyms = SKILL_MAP[userSkill] ?? [{ term: userSkill, boundary: true }];
    // First check skills/tags/category (high confidence), then description (lower confidence)
    const matchedInSkillTag = synonyms.some(({ term, boundary }) => termMatches(skillTagText, term, boundary));
    const matchedInDesc = !matchedInSkillTag && synonyms.some(({ term, boundary }) => termMatches(descText, term, true)); // always boundary in desc

    if (matchedInSkillTag) {
      points += 20; // primary signal — hustle directly uses this skill
      hasAnyMatch = true;
      reasons.push(`matches your ${userSkill} skills`);
    } else if (matchedInDesc) {
      points += 8; // secondary signal — skill mentioned in description
      hasAnyMatch = true;
      reasons.push(`relates to your ${userSkill} skills`);
    }
  }

  return { points: Math.min(points, 60), reasons, hasAnyMatch };
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

  // ── Risk tolerance (20 pts) ──
  const riskRank = getRiskRank(hustle);
  if (answers.riskTolerance === "low") {
    if (riskRank === 1) {
      score += 20;
      reasons.push("low-risk path — little money required upfront");
    } else if (riskRank === 2) {
      score += 8;
    } else {
      score -= 8;
    }
  } else if (answers.riskTolerance === "medium") {
    if (riskRank <= 2) {
      score += 18;
      reasons.push("balanced risk profile");
    } else {
      score += 8;
    }
  } else {
    score += riskRank >= 2 ? 18 : 10;
    if (riskRank >= 2) reasons.push("higher-upside option if you can tolerate uncertainty");
  }

  // ── Skills overlap (60 pts) — primary ranking factor ──
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

export function getRiskLevel(hustle: SideHustle): "Low" | "Medium" | "High" {
  const rank = getRiskRank(hustle);
  if (rank === 1) return "Low";
  if (rank === 2) return "Medium";
  return "High";
}

function getRiskRank(hustle: SideHustle): 1 | 2 | 3 {
  const costRankVal = COST_ORDER[hustle.startupCost] ?? 4;
  const slowIncome = (hustle.timeToFirstIncome ?? "").toLowerCase().includes("month");
  const advanced = hustle.difficulty === "Advanced";
  const passive = hustle.tags.includes("passive");

  if (costRankVal >= 3 || (advanced && slowIncome) || passive) return 3;
  if (costRankVal >= 2 || advanced || slowIncome || !hustle.beginnerFriendly) return 2;
  return 1;
}

// ─── Build skill match explanation ──────────────────────────────────────────
function buildSkillMatchExplanation(hustle: SideHustle, answers: FinderAnswer): string {
  if (answers.skills.length === 0) return "";
  const { reasons, hasAnyMatch } = skillsMatch(hustle, answers.skills);
  if (!hasAnyMatch) return "Your selected skills don't directly match this hustle.";
  const matched = reasons.map(r => r.replace(/^matches your |^relates to your /, "")).slice(0, 3);
  return `Your ${matched.join(", ")} skills are directly applicable here.`;
}

// ─── Build income goal match explanation ────────────────────────────────────
function buildIncomeMatchExplanation(hustle: SideHustle, answers: FinderAnswer): string {
  const incomeRankVal = INCOME_ORDER[hustle.incomePotential] ?? 0;
  const goalLabels: Record<FinderAnswer["incomeGoal"], string> = {
    extra: "$100–$500/month",
    parttime: "$500–$2,000/month",
    fulltime: "$2,000–$5,000/month",
    replace: "$5,000+/month",
  };
  const goal = goalLabels[answers.incomeGoal];
  const potential = hustle.incomePotential;

  if (answers.incomeGoal === "replace" && incomeRankVal >= 4) {
    return `${potential} potential — this can realistically replace a full-time income for motivated earners.`;
  }
  if (answers.incomeGoal === "fulltime" && incomeRankVal >= 3) {
    return `${potential} puts you well within your ${goal} goal.`;
  }
  if (answers.incomeGoal === "parttime" && incomeRankVal >= 2) {
    return `${potential} comfortably covers your ${goal} goal.`;
  }
  if (answers.incomeGoal === "extra" && incomeRankVal >= 1) {
    return `${potential} will exceed your ${goal} goal — upside potential is strong.`;
  }
  return `Income potential is ${potential}. Your goal is ${goal} — achievable with consistent effort.`;
}

// ─── Build potential downsides ───────────────────────────────────────────────
function buildDownsides(hustle: SideHustle, answers: FinderAnswer): string[] {
  const downsides: string[] = [];

  // From cons data
  if (hustle.cons.length > 0) {
    downsides.push(...hustle.cons.slice(0, 2));
  }

  // Contextual warnings
  if (answers.needsQuickIncome) {
    const t = (hustle.timeToFirstIncome ?? "").toLowerCase();
    if (t.includes("month") && !t.includes("1–2") && !t.includes("2–4")) {
      downsides.push(`Slow ramp-up — first income can take ${hustle.timeToFirstIncome}`);
    }
  }
  if (answers.startupBudget === "zero" && hustle.startupCost !== "$0") {
    downsides.push(`Requires upfront investment: ${hustle.startupCost}`);
  }
  if (answers.experienceLevel === "beginner" && hustle.difficulty === "Advanced") {
    downsides.push("Steep learning curve — may need significant skill-building first");
  }

  return [...new Set(downsides)].slice(0, 3);
}

// ─── Get alternative hustles ─────────────────────────────────────────────────
function getAlternativeHustles(hustle: SideHustle, all: SideHustle[]): string[] {
  return all
    .filter((h) => h.slug !== hustle.slug)
    .map((h) => {
      let score = 0;
      if (h.category === hustle.category) score += 30;
      const sharedTags = h.tags.filter((t) => hustle.tags.includes(t)).length;
      score += sharedTags * 10;
      const sharedSkills = h.skills.filter((s) => hustle.skills.includes(s)).length;
      score += sharedSkills * 5;
      return { slug: h.slug, name: h.name, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((h) => h.name);
}

// ─── Get scored recommendations ──────────────────────────────────────────────
export function getScoredRecommendations(
  hustles: SideHustle[],
  answers: FinderAnswer,
  limit = 10
): ScoredHustle[] {
  const hasSkills = answers.skills.length > 0;

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

      // Track skill overlap for filtering
      const { hasAnyMatch: hasSkillMatch } = skillsMatch(hustle, answers.skills);

      return {
        hustle,
        score,
        matchPercent,
        whyMatch: uniqueReasons,
        downsides: buildDownsides(hustle, answers),
        alternatives: getAlternativeHustles(hustle, hustles),
        skillMatchExplanation: buildSkillMatchExplanation(hustle, answers),
        incomeMatchExplanation: buildIncomeMatchExplanation(hustle, answers),
        difficulty: hustle.difficulty,
        confidence,
        hasSkillMatch,
      };
    })
    .filter(({ score, hasSkillMatch }) => {
      // If the user selected skills, only show hustles that match at least one
      if (REQUIRE_SKILL_MATCH_WHEN_SKILLS_SELECTED && hasSkills && !hasSkillMatch) return false;
      return score >= MIN_SCORE_THRESHOLD;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ hustle, score, matchPercent, whyMatch, downsides, alternatives, skillMatchExplanation, incomeMatchExplanation, difficulty, confidence }): ScoredHustle => ({
      hustle,
      score,
      matchPercent,
      whyMatch,
      downsides,
      alternatives,
      skillMatchExplanation,
      incomeMatchExplanation,
      difficulty,
      confidence,
    }));
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
  const riskLabel: Record<FinderAnswer["riskTolerance"], string> = {
    low: "low",
    medium: "moderate",
    high: "higher",
  };
  const skillsNote =
    answers.skills.length > 0
      ? ` Your skills in ${answers.skills.slice(0, 3).join(", ")} were factored in.`
      : "";

  return `You have ${hoursLabel[answers.hoursPerWeek]} per week, prefer ${remote}, have ${answers.experienceLevel}-level experience, and want ${riskLabel[answers.riskTolerance]} risk${quick}. Your target is ${goalLabel[answers.incomeGoal]}.${skillsNote} Based on these factors, <strong>${topNames}</strong> are your strongest matches.`;
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

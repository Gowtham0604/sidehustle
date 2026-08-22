// ─────────────────────────────────────────────────────────────────────────────
// Side Hustle Success Score
// Turns a user's quiz answers + their best-match hustle into a memorable,
// credible, *personalized* readout: a 0–100 score, time to first dollar,
// confidence level, biggest advantage, biggest risk, and a first-week goal.
//
// The score is fully deterministic from the inputs, so two people with the same
// answers get the same score — but it moves meaningfully across the six factors
// the quiz collects, so different users see different scores.
// ─────────────────────────────────────────────────────────────────────────────

import type { FinderAnswer, SideHustle } from "../types/side-hustle";
import { getRiskLevel } from "./hustle";

export interface SuccessScore {
  /** 0–100, clamped to a realistic, motivating band. */
  score: number;
  /** e.g. "14–30 days" */
  timeToFirstDollar: string;
  confidence: "Low" | "Medium" | "High";
  biggestAdvantage: string;
  biggestRisk: string;
  firstWeekGoal: string;
}

/** Minimal shape we need from the best-match recommendation. */
export interface BestMatch {
  hustle: SideHustle;
  matchPercent: number;
  downsides?: string[];
}

// ─── Factor weights (sum to 100) ─────────────────────────────────────────────
const HOURS_POINTS: Record<FinderAnswer["hoursPerWeek"], number> = {
  under5: 8,
  "5to10": 14,
  "10to20": 18,
  "20plus": 20,
};

const BUDGET_POINTS: Record<FinderAnswer["startupBudget"], number> = {
  zero: 7,
  under50: 9,
  under200: 12,
  under500: 14,
  any: 15,
};

const RISK_POINTS: Record<FinderAnswer["riskTolerance"], number> = {
  low: 9,
  medium: 13,
  high: 15,
};

// Lower targets are easier to hit quickly → higher confidence in early success.
const INCOME_POINTS: Record<FinderAnswer["incomeGoal"], number> = {
  extra: 15,
  parttime: 12,
  fulltime: 9,
  replace: 6,
};

const EXPERIENCE_POINTS: Record<FinderAnswer["experienceLevel"], number> = {
  beginner: 8,
  intermediate: 12,
  advanced: 15,
};

function skillsPoints(skillCount: number): number {
  // 0–20 based on how many usable skills the user brings.
  if (skillCount <= 0) return 6;
  if (skillCount === 1) return 12;
  if (skillCount === 2) return 16;
  return 20;
}

// Friendly labels for skills used in advantage/risk copy.
const HOURS_LABEL: Record<FinderAnswer["hoursPerWeek"], string> = {
  under5: "under 5 hours a week",
  "5to10": "5–10 hours a week",
  "10to20": "10–20 hours a week",
  "20plus": "20+ hours a week",
};

// ─── Time to first dollar ────────────────────────────────────────────────────
function parseBaseDays(timeToFirstIncome: string): [number, number] {
  const lower = (timeToFirstIncome ?? "").toLowerCase();
  const nums = (lower.match(/\d+/g) ?? []).map(Number);
  let lo = nums[0] ?? 14;
  let hi = nums[1] ?? lo;

  let mult = 1; // days
  if (lower.includes("month")) mult = 30;
  else if (lower.includes("week")) mult = 7;

  lo *= mult;
  hi *= mult;
  if (hi < lo) [lo, hi] = [hi, lo];
  return [lo, hi];
}

function roundNice(days: number): number {
  if (days <= 14) return Math.max(1, Math.round(days));
  if (days <= 60) return Math.round(days / 5) * 5;
  return Math.round(days / 10) * 10;
}

function buildTimeToFirstDollar(answers: FinderAnswer, hustle: SideHustle): string {
  const [baseLo, baseHi] = parseBaseDays(hustle.timeToFirstIncome);

  // More weekly hours = faster to first dollar.
  const hoursFactor: Record<FinderAnswer["hoursPerWeek"], number> = {
    under5: 1.4,
    "5to10": 1.15,
    "10to20": 1.0,
    "20plus": 0.82,
  };
  const f = hoursFactor[answers.hoursPerWeek];

  const lo = roundNice(baseLo * f);
  const hi = roundNice(baseHi * f);

  if (lo === hi) return `${lo} days`;
  return `${lo}–${hi} days`;
}

// ─── Biggest advantage ───────────────────────────────────────────────────────
function buildAdvantage(answers: FinderAnswer, best: BestMatch): string {
  const candidates: Array<{ weight: number; text: string }> = [];

  if (answers.skills.length > 0) {
    const topSkill = answers.skills[0];
    candidates.push({
      weight: answers.skills.length >= 2 ? 100 : 82,
      text: `strong ${topSkill} skills`,
    });
  }

  if (answers.hoursPerWeek === "20plus") {
    candidates.push({ weight: 88, text: "plenty of weekly time to build momentum fast" });
  } else if (answers.hoursPerWeek === "10to20") {
    candidates.push({ weight: 66, text: "solid weekly time to stay consistent" });
  }

  if (answers.experienceLevel === "advanced") {
    candidates.push({ weight: 76, text: "advanced experience that shortens your ramp-up" });
  } else if (answers.experienceLevel === "intermediate") {
    candidates.push({ weight: 54, text: "real experience to lean on" });
  }

  if (best.hustle.startupCost === "$0") {
    candidates.push({ weight: 64, text: "low startup costs" });
  } else if (answers.startupBudget === "any" || answers.startupBudget === "under500") {
    candidates.push({ weight: 58, text: "a healthy startup budget" });
  }

  if (answers.riskTolerance === "high") {
    candidates.push({ weight: 50, text: "a high risk tolerance for bigger upside" });
  }

  if (answers.incomeGoal === "extra") {
    candidates.push({ weight: 44, text: "a realistic income target" });
  }

  if (answers.experienceLevel === "beginner" && best.hustle.beginnerFriendly) {
    candidates.push({ weight: 40, text: "a beginner-friendly path you can start today" });
  }

  if (candidates.length === 0) {
    return "A clear, focused plan you can act on this week";
  }

  candidates.sort((a, b) => b.weight - a.weight);
  const top = candidates.slice(0, 2).map((c) => c.text);
  const sentence = top.length === 2 ? `${top[0]} and ${top[1]}` : top[0];
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

// ─── Biggest risk ────────────────────────────────────────────────────────────
function buildRisk(answers: FinderAnswer, best: BestMatch): string {
  const candidates: Array<{ weight: number; text: string }> = [];

  if (answers.hoursPerWeek === "under5") {
    candidates.push({ weight: 90, text: "Limited weekly availability" });
  } else if (answers.hoursPerWeek === "5to10") {
    candidates.push({ weight: 48, text: "A tight weekly time budget" });
  }

  if (answers.experienceLevel === "beginner" && best.hustle.difficulty === "Advanced") {
    candidates.push({ weight: 86, text: "A steep learning curve for a beginner" });
  }

  if (answers.startupBudget === "zero" && best.hustle.startupCost !== "$0") {
    candidates.push({ weight: 80, text: `A tight budget against the ${best.hustle.startupCost} startup cost` });
  }

  const slowRamp = (best.hustle.timeToFirstIncome ?? "").toLowerCase().includes("month");
  if (answers.needsQuickIncome && slowRamp) {
    candidates.push({ weight: 78, text: "A slower ramp before your first real income" });
  }

  if (answers.riskTolerance === "low" && getRiskLevel(best.hustle) === "High") {
    candidates.push({ weight: 74, text: "This pick carries more risk than you usually prefer" });
  }

  if (answers.incomeGoal === "replace") {
    candidates.push({ weight: 70, text: "Replacing a full income realistically takes months" });
  } else if (answers.incomeGoal === "fulltime") {
    candidates.push({ weight: 58, text: "An ambitious income target that rewards patience" });
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.weight - a.weight);
    return candidates[0].text;
  }

  if (best.downsides && best.downsides.length > 0) {
    return best.downsides[0];
  }
  return "Staying consistent through the first few slow weeks";
}

// ─── First week goal ─────────────────────────────────────────────────────────
function buildFirstWeekGoal(answers: FinderAnswer, hustle: SideHustle): string {
  const name = hustle.name;
  if (hustle.remote) {
    return `Create 3 ${name} samples and send 10 outreach messages`;
  }
  if (hustle.localAvailable) {
    return `List your ${name} service locally and contact 10 potential clients`;
  }
  return `Set up your ${name} profile and pitch 10 prospects`;
}

// ─── Main ────────────────────────────────────────────────────────────────────
export function computeSuccessScore(answers: FinderAnswer, best: BestMatch): SuccessScore {
  // Weighted factor score (0–100) from the six quiz factors.
  const factorScore =
    HOURS_POINTS[answers.hoursPerWeek] +
    BUDGET_POINTS[answers.startupBudget] +
    skillsPoints(answers.skills.length) +
    RISK_POINTS[answers.riskTolerance] +
    INCOME_POINTS[answers.incomeGoal] +
    EXPERIENCE_POINTS[answers.experienceLevel];

  // Blend with how well the recommended hustle actually fits the answers.
  const matchPercent = Math.max(0, Math.min(100, best.matchPercent || 0));
  const blended = factorScore * 0.8 + matchPercent * 0.2;

  // Clamp to a realistic, motivating band (never demoralizing, never a fake 100).
  const score = Math.max(38, Math.min(97, Math.round(blended)));

  let confidence: SuccessScore["confidence"];
  if (score >= 75) confidence = "High";
  else if (score >= 55) confidence = "Medium";
  else confidence = "Low";

  return {
    score,
    timeToFirstDollar: buildTimeToFirstDollar(answers, best.hustle),
    confidence,
    biggestAdvantage: buildAdvantage(answers, best),
    biggestRisk: buildRisk(answers, best),
    firstWeekGoal: buildFirstWeekGoal(answers, best.hustle),
  };
}

// ─── Presentation ────────────────────────────────────────────────────────────
const RING_CIRCUMFERENCE = 339.292; // 2 * π * 54

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const CONFIDENCE_BADGE: Record<SuccessScore["confidence"], string> = {
  High: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  Medium: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  Low: "bg-slate-400/15 text-slate-300 border-slate-400/30",
};

/**
 * Premium, mobile-first Success Score card. Returns an HTML string so it can be
 * injected by the client scripts that already render results in this project.
 * Call `animateSuccessScore()` after injecting to run the ring + count-up.
 */
export function successScoreCardHTML(s: SuccessScore): string {
  return `
  <article class="success-score-card relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-white shadow-xl" aria-labelledby="success-score-heading">
    <div class="success-score-glow" aria-hidden="true"></div>
    <div class="relative p-5 sm:p-7">
      <div class="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full" style="background:var(--color-violet)" aria-hidden="true"></span>
          <h2 id="success-score-heading" class="text-xs font-bold uppercase tracking-wider" style="color:var(--color-violet)">Success Score</h2>
        </div>
        <button id="share-score-btn" type="button" class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-bold text-white transition-colors hover:bg-white/10">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5.5 9 10.5 6M5.5 7l5 3M12 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Share score
        </button>
      </div>

      <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div class="shrink-0">
          <div class="relative h-36 w-36 sm:h-40 sm:w-40">
            <svg class="h-full w-full -rotate-90" viewBox="0 0 120 120" role="img" aria-label="Success score ${s.score} out of 100">
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#d946a8" />
                  <stop offset="100%" stop-color="#9333ea" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="10" />
              <circle class="score-ring" cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${RING_CIRCUMFERENCE}" stroke-dashoffset="${RING_CIRCUMFERENCE}" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="score-number text-4xl font-bold leading-none tabular-nums sm:text-5xl" data-score="${s.score}">0</span>
              <span class="mt-1 text-xs text-slate-400">out of 100</span>
            </div>
          </div>
        </div>

        <div class="w-full flex-1 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${CONFIDENCE_BADGE[s.confidence]}">
              ${s.confidence} confidence
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 5.5V8.5l2 1.5M8 1.5h0M6 1.5h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              First dollar in ${escapeHtml(s.timeToFirstDollar)}
            </span>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300">Biggest advantage</p>
              <p class="text-sm leading-6 text-slate-100">${escapeHtml(s.biggestAdvantage)}</p>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-amber-300">Biggest risk</p>
              <p class="text-sm leading-6 text-slate-100">${escapeHtml(s.biggestRisk)}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 rounded-xl border border-white/10 p-4 sm:p-5" style="background:linear-gradient(90deg, rgba(217,70,168,0.16), rgba(147,51,234,0.16))">
        <p class="mb-1.5 text-xs font-bold uppercase tracking-wide" style="color:#f0a6dc">First week goal</p>
        <p class="text-sm font-semibold leading-6 text-white sm:text-base">${escapeHtml(s.firstWeekGoal)}</p>
      </div>
    </div>
  </article>`;
}

/**
 * Animates the ring fill and the count-up number inside an already-rendered card.
 * Respects prefers-reduced-motion.
 */
export function animateSuccessScore(root: ParentNode = document): void {
  const numEl = root.querySelector<HTMLElement>(".score-number");
  const ring = root.querySelector<SVGCircleElement>(".score-ring");
  if (!numEl || !ring) return;

  const target = Number(numEl.dataset.score || "0");
  const finalOffset = RING_CIRCUMFERENCE * (1 - target / 100);

  const reduce =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    numEl.textContent = String(target);
    ring.style.strokeDashoffset = String(finalOffset);
    return;
  }

  // Fill the ring.
  requestAnimationFrame(() => {
    ring.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
    ring.style.strokeDashoffset = String(finalOffset);
  });

  // Count up the number.
  const duration = 1200;
  const start = performance.now();
  function tick(now: number) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    numEl.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
    else numEl.textContent = String(target);
  }
  requestAnimationFrame(tick);
}

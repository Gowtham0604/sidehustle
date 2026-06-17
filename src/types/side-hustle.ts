export interface SideHustle {
  slug: string;
  name: string;
  category: string;
  remote: boolean;
  beginnerFriendly: boolean;
  startupCost: string;
  incomePotential: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  description: string;
  pros: string[];
  cons: string[];
  timeToFirstIncome: string;
  tags: string[];
  hoursPerWeek?: string;
  weeklyPay?: boolean;
  localAvailable?: boolean;
}

export interface FinderAnswer {
  remote: "remote" | "local" | "both";
  hoursPerWeek: "under5" | "5to10" | "10to20" | "20plus";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  startupBudget: "zero" | "under50" | "under200" | "under500" | "any";
  needsQuickIncome: boolean;
  riskTolerance: "low" | "medium" | "high";
  skills: string[];
  incomeGoal: "extra" | "parttime" | "fulltime" | "replace";
}

export interface ScoredHustle {
  hustle: SideHustle;
  score: number;
  matchPercent: number;
  whyMatch: string[];
  downsides: string[];
  alternatives: string[];
  skillMatchExplanation: string;
  incomeMatchExplanation: string;
  difficulty: string;
  confidence: "Strong Match" | "Good Match" | "Decent Match";
}

export interface AudienceMeta {
  slug: string;
  title: string;
  headline: string;
  description: string;
  metaDescription: string;
  audience: string;
  filterFn: (h: SideHustle) => boolean;
}

export interface ConstraintMeta {
  slug: string;
  title: string;
  headline: string;
  description: string;
  metaDescription: string;
  constraint: string;
  filterFn: (h: SideHustle) => boolean;
}

// localStorage schemas
export interface SavedResult {
  slug: string;
  name: string;
  matchPercent: number;
  savedAt: number;
}

export interface RecentlyViewed {
  slug: string;
  name: string;
  category: string;
  viewedAt: number;
}

export interface SavedComparison {
  slugA: string;
  slugB: string;
  nameA: string;
  nameB: string;
  savedAt: number;
}

export type StartupCostTier = "$0" | "Under $50" | "$50–$200" | "$200–$500" | "$500+";
export type IncomeTier = "$100–$500/mo" | "$500–$2,000/mo" | "$1,000–$4,000/mo" | "$2,000–$5,000/mo" | "$5,000+/mo";

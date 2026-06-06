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
  skills: string[];
  incomeGoal: "extra" | "parttime" | "fulltime" | "replace";
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

export type StartupCostTier = "$0" | "Under $50" | "$50–$200" | "$200–$500" | "$500+";
export type IncomeTier = "$100–$500/mo" | "$500–$2,000/mo" | "$1,000–$4,000/mo" | "$2,000–$5,000/mo" | "$5,000+/mo";

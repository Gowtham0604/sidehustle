import type { SideHustle, AudienceMeta, ConstraintMeta } from "../types/side-hustle";

// ─── Audience pages ──────────────────────────────────────────────────────────
export const AUDIENCE_PAGES: Omit<AudienceMeta, "filterFn">[] = [
  {
    slug: "side-hustles-for-students",
    title: "Best Side Hustles for Students",
    headline: "Side hustles for students.",
    description: "Flexible, remote-friendly side hustles that work around class schedules. No experience needed.",
    metaDescription: "Discover the best side hustles for college and high school students. Flexible, remote, and beginner-friendly opportunities that fit around your class schedule.",
    audience: "students",
  },
  {
    slug: "side-hustles-for-software-engineers",
    title: "Best Side Hustles for Software Engineers",
    headline: "Side hustles for software engineers.",
    description: "Leverage your coding skills to earn $50–$200/hr with freelance dev, consulting, and SaaS projects.",
    metaDescription: "The best side hustles for software engineers and developers. From freelance development to building SaaS products — find your perfect tech side hustle.",
    audience: "software engineers",
  },
  {
    slug: "side-hustles-for-teachers",
    title: "Best Side Hustles for Teachers",
    headline: "Side hustles for teachers.",
    description: "Turn your teaching expertise into extra income — evenings, weekends, and summers.",
    metaDescription: "Best side hustles for teachers and educators. Use your skills to tutor, create courses, and earn significant extra income.",
    audience: "teachers",
  },
  {
    slug: "side-hustles-for-retirees",
    title: "Best Side Hustles for Retirees",
    headline: "Side hustles for retirees.",
    description: "Flexible, low-stress ways for retirees to supplement income and stay engaged.",
    metaDescription: "Best side hustles for retirees. Flexible, low-stress opportunities that supplement retirement income and keep you engaged.",
    audience: "retirees",
  },
  {
    slug: "side-hustles-for-introverts",
    title: "Best Side Hustles for Introverts",
    headline: "Side hustles for introverts.",
    description: "Solo, remote, and async work that doesn't require constant social interaction.",
    metaDescription: "Best side hustles for introverts. Solo, remote, and async opportunities that let you earn without constant social interaction.",
    audience: "introverts",
  },
  {
    slug: "side-hustles-for-parents",
    title: "Best Side Hustles for Parents",
    headline: "Side hustles for parents.",
    description: "Flexible side hustles that work around school pickups, bedtimes, and family life.",
    metaDescription: "Best side hustles for parents. Flexible opportunities that work around your family schedule and can be done from home.",
    audience: "parents",
  },
  {
    slug: "side-hustles-for-designers",
    title: "Best Side Hustles for Designers",
    headline: "Side hustles for designers.",
    description: "Monetize your design skills with freelance work, digital products, and passive income streams.",
    metaDescription: "Best side hustles for graphic designers, UX designers, and creatives. Leverage your design skills to earn significant extra income.",
    audience: "designers",
  },
  {
    slug: "side-hustles-for-developers",
    title: "Best Side Hustles for Developers",
    headline: "Side hustles for developers.",
    description: "High-income opportunities for frontend, backend, and full-stack developers.",
    metaDescription: "Best side hustles for developers and programmers. From freelance dev to building products — the highest-paying opportunities for coders.",
    audience: "developers",
  },
  {
    slug: "side-hustles-for-nurses",
    title: "Best Side Hustles for Nurses",
    headline: "Side hustles for nurses.",
    description: "Healthcare expertise is highly valuable — discover the best ways for nurses to earn extra income.",
    metaDescription: "Best side hustles for nurses and healthcare professionals. Use your medical expertise to earn premium rates on the side.",
    audience: "nurses",
  },
  {
    slug: "side-hustles-for-accountants",
    title: "Best Side Hustles for Accountants",
    headline: "Side hustles for accountants.",
    description: "Tax prep, bookkeeping, and financial consulting — high-value side hustles that leverage your accounting expertise.",
    metaDescription: "Best side hustles for accountants and CPAs. Lucrative opportunities that leverage your financial expertise.",
    audience: "accountants",
  },
  {
    slug: "side-hustles-for-stay-at-home-moms",
    title: "Best Side Hustles for Stay-at-Home Moms",
    headline: "Side hustles for stay-at-home moms.",
    description: "Flexible, home-based income opportunities that work around your family schedule.",
    metaDescription: "Best side hustles for stay-at-home moms. Flexible, home-based income ideas that fit around your family.",
    audience: "stay-at-home moms",
  },
  {
    slug: "side-hustles-for-lawyers",
    title: "Best Side Hustles for Lawyers",
    headline: "Side hustles for lawyers.",
    description: "Legal expertise commands premium freelance rates — discover the best side hustles for attorneys.",
    metaDescription: "Best side hustles for lawyers and attorneys. High-value opportunities that leverage your legal expertise.",
    audience: "lawyers",
  },
  {
    slug: "side-hustles-for-marketers",
    title: "Best Side Hustles for Marketers",
    headline: "Side hustles for marketers.",
    description: "Turn your marketing skills into a lucrative freelance practice or passive income stream.",
    metaDescription: "Best side hustles for marketing professionals. Leverage your expertise in SEO, social media, ads, and content to earn on the side.",
    audience: "marketers",
  },
  {
    slug: "side-hustles-for-writers",
    title: "Best Side Hustles for Writers",
    headline: "Side hustles for writers.",
    description: "From freelance articles to publishing royalties — the best ways for writers to monetize their craft.",
    metaDescription: "Best side hustles for writers. From freelance copywriting to self-publishing — discover how to turn your writing into significant income.",
    audience: "writers",
  },
  {
    slug: "side-hustles-for-photographers",
    title: "Best Side Hustles for Photographers",
    headline: "Side hustles for photographers.",
    description: "Monetize your photography skills with local gigs, stock photos, and digital products.",
    metaDescription: "Best side hustles for photographers. Real opportunities to turn your passion for photography into meaningful income.",
    audience: "photographers",
  },
];

// ─── Constraint pages ────────────────────────────────────────────────────────
export const CONSTRAINT_PAGES: Omit<ConstraintMeta, "filterFn">[] = [
  {
    slug: "side-hustles-with-no-money",
    title: "Side Hustles With No Money",
    headline: "Side hustles with no money.",
    description: "Start earning with $0 upfront. These side hustles require nothing but your time and skills.",
    metaDescription: "Discover the best side hustles you can start with no money. Zero startup cost opportunities that let you start earning today.",
    constraint: "with no startup cost",
  },
  {
    slug: "side-hustles-with-no-experience",
    title: "Side Hustles With No Experience",
    headline: "Side hustles with no experience.",
    description: "You don't need a portfolio or resume. These beginner-friendly hustles will get you paid fast.",
    metaDescription: "Best side hustles for beginners with no experience. Start earning money today even with zero experience or portfolio.",
    constraint: "requiring no prior experience",
  },
  {
    slug: "side-hustles-from-home",
    title: "Side Hustles From Home",
    headline: "Side hustles from home.",
    description: "Work from your couch, home office, or anywhere with wifi. 100% remote opportunities.",
    metaDescription: "Best side hustles you can do from home. Remote, flexible opportunities that let you earn without leaving the house.",
    constraint: "you can do from home",
  },
  {
    slug: "side-hustles-that-pay-weekly",
    title: "Side Hustles That Pay Weekly",
    headline: "Side hustles that pay weekly.",
    description: "Need money fast? These hustles put cash in your account within a week.",
    metaDescription: "Side hustles that pay weekly or daily. Fast-paying opportunities when you need income quickly.",
    constraint: "that pay weekly or faster",
  },
  {
    slug: "side-hustles-for-beginners",
    title: "Best Side Hustles for Beginners",
    headline: "Side hustles for beginners.",
    description: "New to earning on the side? These beginner-friendly hustles have low barriers and fast ramp-up.",
    metaDescription: "Best side hustles for beginners. Low barrier opportunities that anyone can start with minimal experience or investment.",
    constraint: "for complete beginners",
  },
  {
    slug: "side-hustles-for-full-time-employees",
    title: "Side Hustles for Full-Time Employees",
    headline: "Side hustles that fit around a 9-to-5.",
    description: "Flexible, evenings-and-weekends side hustles that work with your existing job.",
    metaDescription: "Best side hustles for full-time employees. Flexible opportunities that work around your 9-to-5 schedule.",
    constraint: "that work around a full-time job",
  },
  {
    slug: "side-hustles-under-100",
    title: "Side Hustles Under $100 to Start",
    headline: "Side hustles under $100.",
    description: "Low-cost side hustles you can launch for under a hundred dollars.",
    metaDescription: "Side hustles you can start for under $100. Low-investment opportunities with real income potential.",
    constraint: "starting under $100",
  },
  {
    slug: "side-hustles-that-pay-daily",
    title: "Side Hustles That Pay Daily",
    headline: "Side hustles that pay daily.",
    description: "Same-day and daily-pay opportunities — perfect when you need money right now.",
    metaDescription: "Side hustles that can pay you daily or same-day. The fastest ways to put cash in your pocket.",
    constraint: "that pay daily or same-day",
  },
  {
    slug: "high-income-side-hustles",
    title: "High-Income Side Hustles",
    headline: "High-income side hustles.",
    description: "Side hustles with the potential to replace a full-time income — $5,000+/mo in reach.",
    metaDescription: "The best high-income side hustles. Opportunities with $2,000–$10,000+/month earning potential for motivated earners.",
    constraint: "with high income potential",
  },
  {
    slug: "passive-income-side-hustles",
    title: "Passive Income Side Hustles",
    headline: "Passive income side hustles.",
    description: "Build it once, earn repeatedly. Passive income side hustles that generate money while you sleep.",
    metaDescription: "Best passive income side hustles. Build income streams that earn money with minimal ongoing effort.",
    constraint: "that generate passive income",
  },
];

// ─── Audience filter helpers ─────────────────────────────────────────────────
export function audienceFilter(slug: string) {
  return (h: SideHustle): boolean => {
    switch (slug) {
      case "side-hustles-for-students":
        return h.beginnerFriendly && h.remote && (h.startupCost === "$0" || h.startupCost === "Under $50");
      case "side-hustles-for-software-engineers":
        return h.category === "Tech" || h.tags.includes("coding") || h.tags.includes("tech");
      case "side-hustles-for-teachers":
        return h.category === "Education" || h.skills.some((s) => s.toLowerCase().includes("teach")) || h.tags.includes("education");
      case "side-hustles-for-retirees":
        return h.beginnerFriendly && (h.remote || h.localAvailable === true) && h.difficulty !== "Advanced";
      case "side-hustles-for-introverts":
        return h.remote && !h.tags.includes("local");
      case "side-hustles-for-parents":
        return h.remote && (h.hoursPerWeek?.startsWith("5") || h.hoursPerWeek?.startsWith("10"));
      case "side-hustles-for-designers":
        return h.category === "Creative" || h.tags.includes("design") || h.tags.includes("UX");
      case "side-hustles-for-developers":
        return h.category === "Tech" || h.tags.includes("coding") || h.tags.includes("web");
      case "side-hustles-for-nurses":
        return h.category === "Education" || h.category === "Professional Services" || h.tags.includes("coaching");
      case "side-hustles-for-accountants":
        return h.category === "Finance" || h.tags.includes("finance") || h.tags.includes("accounting");
      case "side-hustles-for-stay-at-home-moms":
        return h.remote && h.beginnerFriendly;
      case "side-hustles-for-lawyers":
        return h.category === "Professional Services" || h.tags.includes("consulting");
      case "side-hustles-for-marketers":
        return h.category === "Marketing" || h.tags.includes("marketing") || h.tags.includes("SEO");
      case "side-hustles-for-writers":
        return h.category === "Content Creation" || h.tags.includes("writing");
      case "side-hustles-for-photographers":
        return h.category === "Creative" || h.tags.includes("photography");
      default:
        return true;
    }
  };
}

export function constraintFilter(slug: string) {
  return (h: SideHustle): boolean => {
    switch (slug) {
      case "side-hustles-with-no-money":
        return h.startupCost === "$0";
      case "side-hustles-with-no-experience":
        return h.beginnerFriendly;
      case "side-hustles-from-home":
        return h.remote;
      case "side-hustles-that-pay-weekly":
        return h.weeklyPay === true || (h.timeToFirstIncome ?? "").includes("day");
      case "side-hustles-for-beginners":
        return h.beginnerFriendly;
      case "side-hustles-for-full-time-employees":
        return h.remote && (h.hoursPerWeek?.startsWith("5") || h.hoursPerWeek?.startsWith("10"));
      case "side-hustles-under-100":
        return h.startupCost === "$0" || h.startupCost === "Under $50";
      case "side-hustles-that-pay-daily":
        return (h.timeToFirstIncome ?? "").toLowerCase().includes("day");
      case "high-income-side-hustles":
        return h.incomePotential === "$2,000–$5,000/mo" || h.incomePotential === "$5,000+/mo" || h.incomePotential === "$1,000–$4,000/mo";
      case "passive-income-side-hustles":
        return h.tags.includes("passive");
      default:
        return true;
    }
  };
}

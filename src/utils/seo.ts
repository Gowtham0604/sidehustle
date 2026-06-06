import type { SideHustle } from "../types/side-hustle";

export interface SEOMeta {
  title: string;
  description: string;
  canonical?: string;
}

const SITE_NAME = "SideHustleFinder";
const SITE_URL = "https://sidehustlefinder.com";

export function sideHustleMeta(hustle: SideHustle): SEOMeta {
  return {
    title: `${hustle.name}: How to Start in ${new Date().getFullYear()} | ${SITE_NAME}`,
    description: `Learn how to start ${hustle.name} as a side hustle. Startup cost: ${hustle.startupCost}. Income potential: ${hustle.incomePotential}. ${hustle.description.slice(0, 100)}...`,
    canonical: `${SITE_URL}/side-hustle/${hustle.slug}`,
  };
}

export function audienceMeta(title: string, audience: string, count: number): SEOMeta {
  return {
    title: `${title} | ${SITE_NAME}`,
    description: `Discover the best side hustles for ${audience}. Browse ${count}+ real opportunities with startup costs, income potential, and step-by-step guides.`,
  };
}

export function constraintMeta(title: string, constraint: string, count: number): SEOMeta {
  return {
    title: `${title} | ${SITE_NAME}`,
    description: `Find ${count}+ side hustles ${constraint}. Real opportunities with no fluff — just startup costs, income potential, and how to start today.`,
  };
}

export function comparisonMeta(a: SideHustle, b: SideHustle): SEOMeta {
  return {
    title: `${a.name} vs ${b.name}: Which Side Hustle is Better? | ${SITE_NAME}`,
    description: `Compare ${a.name} and ${b.name} side by side. Income potential, startup cost, difficulty, skills required, and which one fits your situation best.`,
    canonical: `${SITE_URL}/compare/${a.slug}-vs-${b.slug}`,
  };
}

export function homeMeta(): SEOMeta {
  return {
    title: `SideHustleFinder — Find the Best Side Hustle for Your Situation`,
    description: `Answer 7 quick questions and discover side hustles matched to your skills, time, budget, and income goals. 150+ real opportunities. No fluff.`,
    canonical: SITE_URL,
  };
}

export function categoryMeta(category: string, count: number): SEOMeta {
  return {
    title: `${category} Side Hustles (${count} Ideas) | ${SITE_NAME}`,
    description: `Browse ${count} ${category} side hustles with real income data, startup costs, and step-by-step guides to get started today.`,
  };
}

export function jsonLd(hustle: SideHustle): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `How to Start ${hustle.name} as a Side Hustle`,
    description: hustle.description,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/side-hustle/${hustle.slug}`,
    },
  };
  return JSON.stringify(schema);
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
  return JSON.stringify(schema);
}

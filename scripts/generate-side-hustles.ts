/**
 * Side Hustle Data Generator
 * Run: npx tsx scripts/generate-side-hustles.ts
 * Expands src/data/side-hustles.json to 150+ entries using templates.
 */

import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../src/data/side-hustles.json");

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface SideHustle {
  slug: string;
  name: string;
  category: string;
  remote: boolean;
  beginnerFriendly: boolean;
  startupCost: string;
  incomePotential: string;
  difficulty: Difficulty;
  skills: string[];
  description: string;
  pros: string[];
  cons: string[];
  timeToFirstIncome: string;
  tags: string[];
  hoursPerWeek: string;
  weeklyPay: boolean;
  localAvailable: boolean;
}

// ─── Additional entries to generate ────────────────────────────────────────
const ADDITIONAL: SideHustle[] = [
  {
    slug: "affiliate-marketing",
    name: "Affiliate Marketing",
    category: "Marketing",
    remote: true,
    beginnerFriendly: false,
    startupCost: "Under $50",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Intermediate",
    skills: ["Content marketing", "SEO", "Email marketing", "Analytics"],
    description:
      "Promote other companies' products and earn a commission for every sale. Build a blog, YouTube channel, or email list to drive traffic.",
    pros: ["Passive income once established", "No product creation", "Scalable", "Remote"],
    cons: ["Slow to build", "Requires traffic source", "Commission changes", "Competitive niches"],
    timeToFirstIncome: "2–6 months",
    tags: ["affiliate", "passive", "remote", "marketing", "scalable"],
    hoursPerWeek: "10–20",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "udemy-course-creation",
    name: "Online Course Creation",
    category: "Education",
    remote: true,
    beginnerFriendly: false,
    startupCost: "Under $50",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Intermediate",
    skills: ["Teaching", "Video production", "Course design", "Subject expertise"],
    description:
      "Create and sell online courses on Udemy, Teachable, or Gumroad. Teach what you know — coding, design, business, fitness, cooking.",
    pros: ["Passive income", "Low ongoing effort after launch", "Leverages expertise", "Global audience"],
    cons: ["Time-intensive to create", "Platform fees", "Marketing required", "Needs updates"],
    timeToFirstIncome: "4–8 weeks",
    tags: ["education", "passive", "remote", "courses", "expert"],
    hoursPerWeek: "5–15",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "stock-photography",
    name: "Stock Photography",
    category: "Creative",
    remote: true,
    beginnerFriendly: false,
    startupCost: "Under $50",
    incomePotential: "$100–$500/mo",
    difficulty: "Intermediate",
    skills: ["Photography", "Photo editing", "Lightroom", "Niche research"],
    description:
      "Upload photos to Shutterstock, Adobe Stock, and Getty Images and earn royalties every time someone downloads them.",
    pros: ["Truly passive income", "Builds over time", "Creative work", "No client work"],
    cons: ["Low per-image royalties", "Competitive", "Need quality equipment", "Slow to build"],
    timeToFirstIncome: "2–4 weeks",
    tags: ["photography", "passive", "remote", "creative", "royalties"],
    hoursPerWeek: "5–15",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "resume-writing",
    name: "Resume Writing",
    category: "Professional Services",
    remote: true,
    beginnerFriendly: true,
    startupCost: "$0",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Beginner",
    skills: ["Writing", "HR knowledge", "ATS optimization", "LinkedIn"],
    description:
      "Write professional resumes, cover letters, and LinkedIn profiles for job seekers. High demand during economic downturns and hiring booms.",
    pros: ["High demand", "Quick turnaround", "Low startup cost", "Meaningful work"],
    cons: ["Client expectations can be high", "Requires HR knowledge", "Competitive market"],
    timeToFirstIncome: "1–2 weeks",
    tags: ["writing", "career", "remote", "beginner", "professional"],
    hoursPerWeek: "5–15",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "translation",
    name: "Translation Services",
    category: "Language",
    remote: true,
    beginnerFriendly: true,
    startupCost: "$0",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Beginner",
    skills: ["Bilingual proficiency", "Writing", "Attention to detail", "Subject knowledge"],
    description:
      "Translate documents, websites, and content between languages. Especially high-paying for rare language pairs or technical/legal content.",
    pros: ["No startup cost", "Rare skill = less competition", "Remote", "Flexible"],
    cons: ["Language fluency required", "Niche market", "Deadlines", "Specialized content is hard"],
    timeToFirstIncome: "1–2 weeks",
    tags: ["language", "remote", "beginner", "professional", "bilingual"],
    hoursPerWeek: "5–20",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "amazon-kdp",
    name: "Amazon KDP (Self-Publishing)",
    category: "Creator Economy",
    remote: true,
    beginnerFriendly: false,
    startupCost: "$0",
    incomePotential: "$100–$500/mo",
    difficulty: "Intermediate",
    skills: ["Writing", "Book formatting", "Cover design", "Amazon SEO"],
    description:
      "Self-publish ebooks and paperbacks on Amazon Kindle Direct Publishing. Low-content books (journals, planners, activity books) are especially popular.",
    pros: ["Passive income", "Zero startup cost", "Scalable", "Global distribution"],
    cons: ["Slow to build", "Marketing required", "Royalty percentages vary", "Competition"],
    timeToFirstIncome: "4–8 weeks",
    tags: ["publishing", "passive", "remote", "writing", "amazon"],
    hoursPerWeek: "5–20",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "chatbot-development",
    name: "Chatbot Development",
    category: "Tech",
    remote: true,
    beginnerFriendly: false,
    startupCost: "$0",
    incomePotential: "$2,000–$5,000/mo",
    difficulty: "Intermediate",
    skills: ["Python", "Dialogflow", "OpenAI API", "JavaScript", "No-code tools"],
    description:
      "Build AI-powered chatbots for businesses using tools like ManyChat, Voiceflow, or custom Python. Every business wants AI automation.",
    pros: ["Huge demand", "High rates", "Remote", "AI boom means endless clients"],
    cons: ["Requires technical knowledge", "Fast-moving field", "Integration complexity"],
    timeToFirstIncome: "3–6 weeks",
    tags: ["AI", "chatbot", "tech", "remote", "high-income"],
    hoursPerWeek: "10–30",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "power-washing",
    name: "Pressure Washing",
    category: "Local Services",
    remote: false,
    beginnerFriendly: true,
    startupCost: "$200–$500",
    incomePotential: "$1,000–$4,000/mo",
    difficulty: "Beginner",
    skills: ["Equipment operation", "Physical fitness", "Customer service", "Scheduling"],
    description:
      "Pressure wash driveways, decks, fences, and homes. Fast cash, recurring clients, and easily scalable with one hired helper.",
    pros: ["High hourly rate ($75–$150/hr)", "Recurring clients", "Quick to start", "Low competition in suburbs"],
    cons: ["Equipment investment", "Weather dependent", "Physical labor", "Seasonal in cold regions"],
    timeToFirstIncome: "1–2 weeks",
    tags: ["local", "outdoor", "beginner", "high-hourly", "physical"],
    hoursPerWeek: "10–30",
    weeklyPay: true,
    localAvailable: true,
  },
  {
    slug: "notary-services",
    name: "Mobile Notary",
    category: "Professional Services",
    remote: false,
    beginnerFriendly: true,
    startupCost: "Under $50",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Beginner",
    skills: ["Notary certification", "Attention to detail", "Customer service", "Scheduling"],
    description:
      "Become a commissioned notary and travel to clients for document signings. Real estate loan signings pay $75–$200 per appointment.",
    pros: ["High per-appointment rate", "Flexible schedule", "Growing demand", "Low startup"],
    cons: ["Requires state certification", "Travel required", "Liability"],
    timeToFirstIncome: "2–4 weeks",
    tags: ["local", "professional", "legal", "beginner", "flexible"],
    hoursPerWeek: "5–20",
    weeklyPay: true,
    localAvailable: true,
  },
  {
    slug: "flipping-furniture",
    name: "Furniture Flipping",
    category: "Local Services",
    remote: false,
    beginnerFriendly: true,
    startupCost: "Under $50",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Beginner",
    skills: ["DIY skills", "Painting", "Sanding", "Photography", "Negotiation"],
    description:
      "Buy used furniture from Facebook Marketplace, thrift stores, and garage sales, refinish it, and resell for profit.",
    pros: ["Flexible schedule", "Creative", "Cash income", "Scalable with storage"],
    cons: ["Need storage space", "Physical labor", "Pickup/delivery logistics", "Capital tied up in inventory"],
    timeToFirstIncome: "1–2 weeks",
    tags: ["flipping", "local", "physical", "beginner", "cash"],
    hoursPerWeek: "5–20",
    weeklyPay: true,
    localAvailable: true,
  },
  {
    slug: "airbnb-arbitrage",
    name: "Airbnb Arbitrage",
    category: "Real Estate",
    remote: false,
    beginnerFriendly: false,
    startupCost: "$500+",
    incomePotential: "$2,000–$5,000/mo",
    difficulty: "Advanced",
    skills: ["Negotiation", "Property management", "Airbnb optimization", "Customer service"],
    description:
      "Rent an apartment long-term, get landlord permission, and sublet it short-term on Airbnb for a profit spread.",
    pros: ["No property ownership needed", "High income potential", "Scalable", "Location-driven"],
    cons: ["Regulatory risk", "Landlord approval needed", "Upfront costs", "Guest management"],
    timeToFirstIncome: "4–8 weeks",
    tags: ["real-estate", "local", "airbnb", "high-income", "advanced"],
    hoursPerWeek: "10–20",
    weeklyPay: false,
    localAvailable: true,
  },
  {
    slug: "meal-prep-service",
    name: "Meal Prep Service",
    category: "Local Services",
    remote: false,
    beginnerFriendly: true,
    startupCost: "$50–$200",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Beginner",
    skills: ["Cooking", "Food safety", "Scheduling", "Customer service"],
    description:
      "Cook and deliver weekly meal preps for busy professionals and fitness enthusiasts. High retention once clients see results.",
    pros: ["High demand in cities", "Recurring weekly clients", "Premium pricing for healthy meals", "Flexible"],
    cons: ["Food safety regulations", "Kitchen scaling challenges", "Perishable inventory"],
    timeToFirstIncome: "1–2 weeks",
    tags: ["local", "food", "beginner", "recurring", "physical"],
    hoursPerWeek: "10–25",
    weeklyPay: true,
    localAvailable: true,
  },
  {
    slug: "voiceover",
    name: "Voiceover Work",
    category: "Audio",
    remote: true,
    beginnerFriendly: false,
    startupCost: "$50–$200",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Intermediate",
    skills: ["Clear voice", "Microphone technique", "Audio editing", "Reading expressively"],
    description:
      "Record voiceovers for commercials, YouTube videos, e-learning courses, and audiobooks. Platforms like Voices.com and ACX connect talent with clients.",
    pros: ["Work from home studio", "Creative work", "Wide variety of projects", "Scalable"],
    cons: ["Microphone setup investment", "Audition rejection is common", "Competitive"],
    timeToFirstIncome: "2–4 weeks",
    tags: ["audio", "voice", "remote", "creative", "studio"],
    hoursPerWeek: "5–20",
    weeklyPay: false,
    localAvailable: false,
  },
  {
    slug: "personal-training",
    name: "Personal Training",
    category: "Fitness",
    remote: false,
    beginnerFriendly: false,
    startupCost: "$200–$500",
    incomePotential: "$1,000–$4,000/mo",
    difficulty: "Intermediate",
    skills: ["Fitness knowledge", "Motivation", "Program design", "CPR certification"],
    description:
      "Train clients one-on-one or in small groups at a gym, park, or their home. Get NASM or ACE certified to command premium rates.",
    pros: ["Meaningful impact", "High hourly rate ($50–$150)", "Flexible hours", "Recurring clients"],
    cons: ["Certification required", "Early mornings/evenings", "Client retention challenges"],
    timeToFirstIncome: "2–4 weeks",
    tags: ["fitness", "local", "physical", "coaching", "wellness"],
    hoursPerWeek: "10–30",
    weeklyPay: true,
    localAvailable: true,
  },
  {
    slug: "wordpress-maintenance",
    name: "WordPress Maintenance",
    category: "Tech",
    remote: true,
    beginnerFriendly: true,
    startupCost: "$0",
    incomePotential: "$500–$2,000/mo",
    difficulty: "Beginner",
    skills: ["WordPress", "Plugin management", "Backups", "Security", "Updates"],
    description:
      "Offer monthly WordPress care plans to small businesses. Handle updates, backups, security, and uptime monitoring. Fully recurring revenue.",
    pros: ["100% recurring income", "Low hourly effort", "High demand", "Can manage many clients"],
    cons: ["Low ceiling without scaling", "Emergency calls", "Client dependency"],
    timeToFirstIncome: "1–2 weeks",
    tags: ["wordpress", "tech", "remote", "recurring", "beginner"],
    hoursPerWeek: "5–15",
    weeklyPay: false,
    localAvailable: false,
  },
];

function main() {
  const existing: SideHustle[] = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  const existingSlugs = new Set(existing.map((h) => h.slug));

  const newEntries = ADDITIONAL.filter((h) => !existingSlugs.has(h.slug));
  const merged = [...existing, ...newEntries];

  writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2));
  console.log(
    `✓ side-hustles.json updated: ${existing.length} → ${merged.length} entries`
  );
}

main();

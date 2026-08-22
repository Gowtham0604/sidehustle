export type JobCategory =
  | "Restaurant & Cafe"
  | "Retail"
  | "Delivery"
  | "Warehouse"
  | "Events"
  | "Tutoring"
  | "Hospitality"
  | "Office/Admin"
  | "Customer Support"
  | "Fitness"
  | "Pet Care"
  | "Freelance"
  | "Other";

export interface PartTimeJob {
  slug: string;
  title: string;
  company: string;
  category: JobCategory;
  employmentType: string;
  schedule: string[];
  experience: string;
  salary: string;
  salaryPeriod: string;
  description: string;
  address: string;
  area: string;
  city: "Bengaluru";
  lat: number;
  lng: number;
  applicationUrl: string;
  companyWebsite: string;
  postedAt: string;
  hiringStatus: string;
  requirements: string[];
}

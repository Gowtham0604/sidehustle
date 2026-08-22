import jobData from "../data/part-time-jobs.json";
import type { PartTimeJob } from "../types/job";

export const jobs = jobData as PartTimeJob[];

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug);
}

export function getAreas() {
  return [...new Set(jobs.map((job) => job.area))].sort();
}

export function getCategories() {
  return [...new Set(jobs.map((job) => job.category))].sort();
}

export function distanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const earthRadius = 6371;
  const latDelta = ((toLat - fromLat) * Math.PI) / 180;
  const lngDelta = ((toLng - fromLng) * Math.PI) / 180;
  const a = Math.sin(latDelta / 2) ** 2 + Math.cos((fromLat * Math.PI) / 180) * Math.cos((toLat * Math.PI) / 180) * Math.sin(lngDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(distance: number) {
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
}

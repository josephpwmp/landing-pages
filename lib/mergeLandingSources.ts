import type { LandingPage } from "@/types/landing";
import { loadLandingConfigsFromCsv } from "@/lib/landingConfigsCsv";

/**
 * All landing pages come from `data/landing-configs.csv`
 * (Google Ads export was migrated from `test-source.csv` — see `npm run migrate:csv`).
 */
export function loadAllLandingPagesMerged(): LandingPage[] {
  return loadLandingConfigsFromCsv();
}

export function getMergedServiceAreaCities(): string[] {
  const names = new Set<string>();
  for (const p of loadAllLandingPagesMerged()) {
    const c = p.city?.trim();
    if (c && c !== "Your Area") names.add(c);
    for (const x of p.serviceCitiesList ?? []) {
      const t = x.trim();
      if (t) names.add(t);
    }
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

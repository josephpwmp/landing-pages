/**
 * One-time / repeat: merge Google Ads `test-source.csv` into `data/landing-configs.csv`.
 * Run: npm run migrate:csv
 */
import { migrateAdsCsvToLandingConfigsFile } from "@/lib/migrateAdsCsvToLandingConfigsFile";

const r = migrateAdsCsvToLandingConfigsFile();
// eslint-disable-next-line no-console
console.log(
  `[migrate:csv] rows in file before: ${r.rowsBefore}, ads rows imported: ${r.adsRowsImported}, skipped (slug already in configs): ${r.adsRowsSkippedDuplicateSlug}`
);

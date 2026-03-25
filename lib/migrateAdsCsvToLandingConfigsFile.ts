import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import {
  parseAdsExportRow,
  resolveAdsCsvPath,
  defaultPhoneForAdsExport,
  type AdsCsvRowParsed,
} from "@/lib/csvSource";
import { LANDING_CONFIG_HEADER } from "@/lib/landingConfigConstants";
import { rowToCsvLine } from "@/lib/csvWrite";
import { getLandingConfigCsvPath } from "@/lib/landingConfigsCsv";

function normalizeRecord(r: Record<string, string>): Record<string, string> {
  const o: Record<string, string> = {};
  for (const k of LANDING_CONFIG_HEADER) {
    o[k] = (r[k] ?? "").trim();
  }
  return o;
}

function adsParsedToConfigRecord(
  p: AdsCsvRowParsed,
  phone: string
): Record<string, string> {
  const o: Record<string, string> = {};
  for (const k of LANDING_CONFIG_HEADER) o[k] = "";
  o.slug = p.slug;
  o.template_key = "window_cleaning";
  o.headline = p.headline;
  o.subheadline = p.subheadline;
  o.brand_name = p.businessName;
  o.phone = phone;
  o.call_extension = phone;
  o.discount_amount = "25";
  o.counties_state = "Central Florida";
  o.main_city = p.cityDisplay;
  o.cities_json = "[]";
  o.form_action_url = p.finalUrl;
  o.created_iso = new Date().toISOString();
  return o;
}

/**
 * Merges `test-source.csv` rows into `data/landing-configs.csv`.
 * Rows already present (by `slug`) are left unchanged so generator submissions win.
 */
export function migrateAdsCsvToLandingConfigsFile(): {
  adsRowsImported: number;
  adsRowsSkippedDuplicateSlug: number;
  rowsBefore: number;
} {
  const adsPath = resolveAdsCsvPath();
  const configPath = getLandingConfigCsvPath();
  const phone = defaultPhoneForAdsExport();

  const bySlug = new Map<string, Record<string, string>>();
  let rowsBefore = 0;

  if (fs.existsSync(configPath) && fs.statSync(configPath).size > 0) {
    const text = fs.readFileSync(configPath, "utf8");
    if (text.trim()) {
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      }) as Record<string, string>[];
      for (const r of records) {
        const slug = (r.slug ?? "").trim();
        if (!slug) continue;
        bySlug.set(slug, normalizeRecord(r));
        rowsBefore += 1;
      }
    }
  }

  let adsRowsImported = 0;
  let adsRowsSkippedDuplicateSlug = 0;

  if (adsPath) {
    const rawFile = fs.readFileSync(adsPath, "utf8");
    const rows = parse(rawFile, {
      relax_column_count: true,
      skip_empty_lines: true,
      trim: true,
    }) as string[][];

    for (const row of rows.slice(1)) {
      const p = parseAdsExportRow(row);
      if (!p) continue;
      if (bySlug.has(p.slug)) {
        adsRowsSkippedDuplicateSlug += 1;
        continue;
      }
      bySlug.set(p.slug, adsParsedToConfigRecord(p, phone));
      adsRowsImported += 1;
    }
  }

  fs.mkdirSync(path.dirname(configPath), { recursive: true });

  let out = rowToCsvLine([...LANDING_CONFIG_HEADER]);
  const slugs = Array.from(bySlug.keys()).sort((a, b) => a.localeCompare(b));
  for (const slug of slugs) {
    const r = bySlug.get(slug)!;
    out += rowToCsvLine(LANDING_CONFIG_HEADER.map((k) => r[k] ?? ""));
  }
  fs.writeFileSync(configPath, out, "utf8");

  return {
    adsRowsImported,
    adsRowsSkippedDuplicateSlug,
    rowsBefore,
  };
}

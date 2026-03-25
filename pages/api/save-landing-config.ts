import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { parse } from "csv-parse/sync";
import {
  LANDING_CONFIG_HEADER,
  TEMPLATE_META,
  type TemplateKey,
} from "@/lib/landingConfigConstants";
import { rowToCsvLine } from "@/lib/csvWrite";
import { getLandingConfigCsvPath } from "@/lib/landingConfigsCsv";

export const config = {
  api: {
    bodyParser: false,
  },
};

function fieldOne(fields: formidable.Fields, key: string): string {
  const v = fields[key];
  if (v === undefined) return "";
  return Array.isArray(v) ? (v[0] ?? "") : v;
}

function firstFile(
  files: formidable.Files,
  key: string
): formidable.File | undefined {
  const f = files[key];
  if (!f) return undefined;
  return Array.isArray(f) ? f[0] : f;
}

function slugify(s: string): string {
  const out = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return out || "landing";
}

function readGeneratorSlugs(csvPath: string): Set<string> {
  const slugs = new Set<string>();
  if (!fs.existsSync(csvPath)) return slugs;
  const text = fs.readFileSync(csvPath, "utf8");
  if (!text.trim()) return slugs;
  try {
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, string>[];
    for (const r of records) {
      const s = String(r.slug ?? "").trim();
      if (s) slugs.add(s);
    }
  } catch {
    /* ignore */
  }
  return slugs;
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let s = base || "landing";
  if (!taken.has(s)) return s;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function moveUploaded(
  file: formidable.File | undefined,
  destDir: string,
  baseName: string
): string {
  if (!file?.filepath || !fs.existsSync(file.filepath)) return "";
  const size = file.size ?? fs.statSync(file.filepath).size;
  if (size === 0) {
    try {
      fs.unlinkSync(file.filepath);
    } catch {
      /* ignore */
    }
    return "";
  }
  const ext =
    path.extname(file.originalFilename || "") ||
    path.extname(file.filepath) ||
    ".bin";
  const safe = `${baseName}${ext}`;
  const full = path.join(destDir, safe);
  fs.renameSync(file.filepath, full);
  const uploadId = path.basename(destDir);
  return `/uploads/landing/${uploadId}/${safe}`;
}

function ensureCsvWithHeader(csvPath: string) {
  const dir = path.dirname(csvPath);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(csvPath) || fs.statSync(csvPath).size === 0) {
    fs.writeFileSync(
      csvPath,
      rowToCsvLine([...LANDING_CONFIG_HEADER]),
      "utf8"
    );
  }
}

type OkBody = { ok: true; slug: string; landingPath: string };
type ErrBody = { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OkBody | ErrBody>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const csvPath = getLandingConfigCsvPath();
    ensureCsvWithHeader(csvPath);

    const uploadId = randomBytes(8).toString("hex");
    const destDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "landing",
      uploadId
    );
    fs.mkdirSync(destDir, { recursive: true });

    const form = formidable({
      uploadDir: destDir,
      keepExtensions: true,
      maxFileSize: 18 * 1024 * 1024,
      multiples: false,
      /** Optional file inputs often send 0-byte parts; defaults reject those. */
      allowEmptyFiles: true,
      minFileSize: 0,
    });

    const [fields, files] = await form.parse(req);

    const brand = fieldOne(fields, "brand_name").trim();
    const phone = fieldOne(fields, "phone").trim();
    const mainCity = fieldOne(fields, "main_city").trim();

    if (!brand || !phone || !mainCity) {
      return res.status(400).json({
        ok: false,
        error: "Brand name, phone, and main city are required.",
      });
    }

    const rawTemplate = fieldOne(fields, "template_key").trim() as TemplateKey;
    const templateKey = TEMPLATE_META[rawTemplate]
      ? rawTemplate
      : "window_cleaning";

    const requestedSlug = fieldOne(fields, "slug").trim();
    const baseSlug = requestedSlug
      ? slugify(requestedSlug)
      : slugify(`${mainCity}-${templateKey}`);

    const taken = readGeneratorSlugs(csvPath);
    const slug = uniqueSlug(baseSlug, taken);

    const discountRaw = fieldOne(fields, "discount_amount").trim();
    const discountAmount = discountRaw || "75";

    const row: Record<string, string> = {
      slug,
      template_key: templateKey,
      headline: "",
      subheadline: "",
      brand_name: brand,
      phone,
      call_extension:
        fieldOne(fields, "call_extension").trim() || phone,
      discount_amount: discountAmount,
      counties_state: fieldOne(fields, "counties_state").trim(),
      main_city: mainCity,
      cities_json: fieldOne(fields, "cities_json").trim() || "[]",
      review1_name: fieldOne(fields, "review1_name").trim(),
      review1_text: fieldOne(fields, "review1_text").trim(),
      review2_name: fieldOne(fields, "review2_name").trim(),
      review2_text: fieldOne(fields, "review2_text").trim(),
      logo_path: "",
      hero_contact_image: "",
      section2_image: "",
      why_choose_image: "",
      ba1: "",
      ba2: "",
      ba3: "",
      ba4: "",
      ba5: "",
      ba6: "",
      whatconverts_script: fieldOne(fields, "whatconverts_script").trim(),
      color_section_bg: fieldOne(fields, "color_section_bg").trim(),
      color_cta_red: fieldOne(fields, "color_cta_red").trim(),
      color_cta_green: fieldOne(fields, "color_cta_green").trim(),
      form_action_url: fieldOne(fields, "form_action_url").trim() || "#",
      created_iso: new Date().toISOString(),
    };

    row.logo_path = moveUploaded(firstFile(files, "logo"), destDir, "logo");
    row.hero_contact_image = moveUploaded(
      firstFile(files, "contact_image"),
      destDir,
      "hero-contact"
    );
    row.section2_image = moveUploaded(
      firstFile(files, "section2_image"),
      destDir,
      "section2"
    );
    row.why_choose_image = moveUploaded(
      firstFile(files, "why_choose_image"),
      destDir,
      "why-choose"
    );

    const photoCountRaw = fieldOne(fields, "photo_count").trim();
    const maxBa = photoCountRaw === "6" ? 6 : 3;
    for (let i = 1; i <= maxBa; i++) {
      const key = `ba${i}` as "ba1" | "ba2" | "ba3" | "ba4" | "ba5" | "ba6";
      row[key] = moveUploaded(firstFile(files, `ba${i}`), destDir, `ba${i}`);
    }

    if (!row.hero_contact_image) {
      row.hero_contact_image = "";
    }

    const line = rowToCsvLine(
      LANDING_CONFIG_HEADER.map((col) => row[col] ?? "")
    );
    fs.appendFileSync(csvPath, line, "utf8");

    return res.status(200).json({
      ok: true,
      slug,
      landingPath: `/landing/${slug}`,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed";
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, error: msg });
    }
    return;
  }
}

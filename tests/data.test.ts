/**
 * Guards on the content itself. The site's claims are copied from each project's committed
 * evidence by hand, so these tests cannot prove a number right; they catch the ways the copy
 * drifts: a broken reference, a missing screenshot, a wording the projects themselves rule out,
 * and — for the plain-English home page — jargon, or a simplification that drops a caveat.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { getProject, leadMetric, projects } from "@/data/projects";
import { coreTechnologies } from "@/data/skills";

const slugs = projects.map((p) => p.slug);

/** Every string anywhere in a value, with the path it was found at. */
function strings(value: unknown, at = "$"): [string, string][] {
  if (typeof value === "string") return [[at, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${at}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${at}.${k}`));
  }
  return [];
}

const copy = [
  ...strings(projects, "projects"),
  ...strings(coreTechnologies, "skills"),
  ...strings(profile, "profile"),
];

/** Words a recruiter should not have to decode. They belong in the case studies' technical parts. */
const JARGON =
  /idempoten|bitemporal|pgvector|hold-?out|effectively[- ]once|exactly[- ]once|skip locked|\bF1\b|\brecall\b|kill condition|vacuous|outbox|\bDLQ\b|\benum\b|JWKS|attenuat|canonical|lineage|\bMCP\b|deterministic|heuristic/i;

/** The plain-English sentences: the home page and the top of each case study. */
const plainCopy: [string, string][] = [
  ["profile.headline", profile.headline],
  ["profile.worksWith", profile.worksWith],
  ["profile.independence", profile.independence],
  ...projects.flatMap((p): [string, string][] => [
    [`${p.slug}.does`, p.plain.does],
    [`${p.slug}.matters`, p.plain.matters],
    [`${p.slug}.built`, p.plain.built],
    ...(p.plain.figure ? [[`${p.slug}.figure`, p.plain.figure.label] as [string, string]] : []),
    ...(p.plain.caveat ? [[`${p.slug}.caveat`, p.plain.caveat] as [string, string]] : []),
  ]),
];

const RENDER_NOTE = "Free demo — may take ~1 min to wake.";

describe("projects", () => {
  it("are the seven published projects, in order, with unique slugs", () => {
    expect(projects.map((p) => p.index)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("feature exactly the three flagships", () => {
    expect(projects.filter((p) => p.flagship).map((p) => p.index)).toEqual([1, 4, 6]);
  });

  it("show Parts Answer Gate's status exactly as its tracker records it", () => {
    const parts = getProject("parts-answer-gate");
    expect(parts?.status).toEqual({
      kind: "negative-result",
      label: "Closed — pre-registered negative result",
      deployment: "Deployed / live",
    });
    expect(projects.filter((p) => p.status.kind === "negative-result")).toHaveLength(1);
  });

  it("link only to the owner's repositories and to public deployments", () => {
    for (const p of projects) {
      expect(p.githubUrl).toBe(`https://github.com/tair800/${p.slug}`);
      expect(p.liveUrl).toMatch(/^https:\/\/[a-z0-9-]+\.(vercel\.app|onrender\.com)$/);
      if (p.backendUrl) expect(p.backendUrl).toMatch(/^https:\/\/[a-z0-9-]+\.onrender\.com\/[\w./-]+$/);
    }
  });

  it("carry one short wake-up note, exactly where the host shows its own wake-up screen", () => {
    for (const p of projects) {
      expect(p.demoNote, p.slug).toBe(p.liveUrl.endsWith(".onrender.com") ? RENDER_NOTE : undefined);
    }
  });

  it("carry their evidence, limitations and screenshots", () => {
    for (const p of projects) {
      expect(p.evidence.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.evidence.filter((m) => m.lead), p.slug).toHaveLength(1);
      expect(p.limitations.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.shots.length, p.slug).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("the plain-English view", () => {
  it("says what each project does, why it matters, what was built and what it showed", () => {
    for (const p of projects) {
      for (const [field, text] of Object.entries({ does: p.plain.does, matters: p.plain.matters, built: p.plain.built })) {
        expect(text.length, `${p.slug}.${field}`).toBeLessThanOrEqual(170);
        expect(text.split(/[.;]\s/).length, `${p.slug}.${field}: one sentence`).toBe(1);
      }
      expect(p.plain.built, p.slug).toMatch(/^Built /);
      expect(p.plain.result.length, p.slug).toBeLessThanOrEqual(260);
    }
  });

  it("gives each flagship one figure, the same one its evidence leads with", () => {
    const squash = (value: string) => value.replace(/\s+/g, "");
    for (const p of projects) {
      expect(Boolean(p.plain.figure), p.slug).toBe(p.flagship);
      if (!p.plain.figure) continue;
      expect(squash(p.plain.figure.value), p.slug).toBe(squash(leadMetric(p).value));
      expect(p.plain.figure.label.length, p.slug).toBeLessThanOrEqual(110);
    }
  });

  it("names at most four technologies per project, each from its own stack", () => {
    for (const p of projects) {
      expect(p.plain.tech.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.plain.tech.length, p.slug).toBeLessThanOrEqual(4);
      for (const tech of p.plain.tech) {
        const listed = p.stack.some((item) => item.toLowerCase().startsWith(tech.toLowerCase()));
        expect(listed, `${p.slug}: ${tech}`).toBe(true);
      }
    }
  });

  it("carries a negative result to the home page as a plain caveat", () => {
    for (const p of projects) {
      if (leadMetric(p).tone === "fail") expect(p.plain.caveat, p.slug).toBeTruthy();
    }
    expect(getProject("parts-answer-gate")?.plain.caveat).toMatch(/closed/i);
  });

  it("uses no engineering jargon", () => {
    for (const [at, text] of plainCopy) expect(text, at).not.toMatch(JARGON);
  });
});

describe("screenshots", () => {
  const shots = projects.flatMap((p) =>
    p.shots.flatMap((s) => [
      { slug: p.slug, src: s.src, width: s.width, height: s.height },
      ...(s.darkSrc ? [{ slug: p.slug, src: s.darkSrc, width: s.width, height: s.height }] : []),
    ]),
  );

  it.each(shots)("$src exists at its declared size", async ({ slug, src, width, height }) => {
    expect(src.startsWith(`/shots/${slug}/`)).toBe(true);
    const file = path.join(process.cwd(), "public", src);
    expect(existsSync(file)).toBe(true);
    const meta = await sharp(file).metadata();
    expect([meta.width, meta.height]).toEqual([width, height]);
  });
});

describe("core technologies", () => {
  it("are a short list of names, each with evidence", () => {
    expect(coreTechnologies.length).toBeLessThanOrEqual(14);
    for (const technology of coreTechnologies) {
      expect(technology.projects.length > 0 || technology.role === true, technology.name).toBe(true);
      for (const slug of technology.projects) expect(slugs, `${technology.name}: ${slug}`).toContain(slug);
    }
  });
});

describe("wording", () => {
  it("avoids self-promotional labels", () => {
    const hype = /\b(guru|visionary|10x|world[- ]class|revolutionary|cutting[- ]edge|rockstar|ninja|passionate|game[- ]chang)/i;
    for (const [at, text] of copy) expect(text, at).not.toMatch(hype);
  });

  it("never claims exactly-once delivery or transport", () => {
    for (const [at, text] of copy) {
      for (const match of text.matchAll(/exactly[- ]once/gi)) {
        const before = text.slice(Math.max(0, (match.index ?? 0) - 12), match.index);
        expect(before, at).toMatch(/not /i);
      }
    }
  });

  it("never calls the public projects production work, and claims no agentic systems", () => {
    for (const [at, text] of [...strings(projects, "projects"), ...plainCopy]) {
      expect(text, at).not.toMatch(/(?<!non-)\bproduction\b/i);
      expect(text, at).not.toMatch(/\bagentic\b/i);
    }
  });

  it("never implies the Azure infrastructure was deployed", () => {
    for (const [at, text] of copy) {
      if (/azure/i.test(text)) expect(text, at).toMatch(/never applied|not applied|nothing has been applied|validate/i);
    }
  });

  it("names only the conflict rules Market Approach Desk's claim transaction implements", () => {
    for (const [at, text] of strings(getProject("market-approach-desk"), "market-approach-desk")) {
      expect(text, at).not.toMatch(/held by another broker|every eligibility rule/i);
    }
  });

  it("does not name data sources the entity-resolution corpus did not use", () => {
    for (const [at, text] of copy) expect(text, at).not.toMatch(/companies house|opensanctions/i);
  });

  it("publishes no email address", () => {
    for (const [at, text] of copy) expect(text, at).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });
});

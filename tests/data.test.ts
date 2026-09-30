/**
 * Guards on the content itself. The site's claims are copied from each project's committed
 * evidence by hand, so these tests cannot prove a number right; they catch the ways the copy
 * drifts: a broken reference, a missing screenshot, a wording the projects themselves rule out.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { capabilityGroups } from "@/data/capabilities";
import { principles } from "@/data/principles";
import { profile } from "@/data/profile";
import { getProject, leadMetric, projects } from "@/data/projects";

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
  ...strings(capabilityGroups, "capabilities"),
  ...strings(principles, "principles"),
  ...strings(profile, "profile"),
];

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

  it("warn about a slow first load exactly where the host shows its own wake-up screen", () => {
    for (const p of projects) {
      const hostedOnRender = p.liveUrl.endsWith(".onrender.com");
      expect(Boolean(p.demoNote), p.slug).toBe(hostedOnRender);
    }
  });

  it("carry their evidence, limitations and screenshots", () => {
    for (const p of projects) {
      expect(p.evidence.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.limitations.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.shots.length, p.slug).toBeGreaterThanOrEqual(1);
    }
  });

  it("mark exactly one figure each for the home page", () => {
    for (const p of projects) {
      expect(p.evidence.filter((m) => m.lead), p.slug).toHaveLength(1);
      expect(p.evidence).toContain(leadMetric(p));
    }
  });

  it("keep Parts Answer Gate's lead figure the failed release gate", () => {
    const parts = getProject("parts-answer-gate");
    expect(parts && leadMetric(parts)).toMatchObject({ value: "4 of 12", tone: "fail" });
  });

  it("give each flagship a one-line card with at most five of its own skills", () => {
    for (const p of projects) {
      expect(Boolean(p.brief), p.slug).toBe(p.flagship);
      if (!p.brief) continue;
      for (const line of [p.brief.problem, p.brief.built]) {
        expect(line.length, `${p.slug}: ${line}`).toBeLessThanOrEqual(150);
        expect(line.split(/[.;]\s/).length, `${p.slug}: one sentence`).toBe(1);
      }
      expect(p.brief.skills.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.brief.skills.length, p.slug).toBeLessThanOrEqual(5);
      for (const skill of p.brief.skills) expect(p.skills, p.slug).toContain(skill);
    }
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

describe("home page", () => {
  it("states at most three principles, one short line each", () => {
    expect(principles.length).toBeLessThanOrEqual(3);
    for (const principle of principles) expect(principle.detail.length, principle.title).toBeLessThanOrEqual(110);
  });

  it("groups skills into at most four compact groups", () => {
    expect(capabilityGroups.length).toBeLessThanOrEqual(4);
    for (const group of capabilityGroups) expect(group.items.length, group.title).toBeLessThanOrEqual(5);
  });

  it("keeps the current role to a summary and three areas", () => {
    for (const role of profile.experience) expect(role.areas.length, role.title).toBeLessThanOrEqual(3);
  });
});

describe("cross-references", () => {
  it("point every capability at a real project", () => {
    for (const slug of capabilityGroups.flatMap((g) => g.items.flatMap((i) => i.projects))) {
      expect(slugs, slug).toContain(slug);
    }
  });

  it("give every capability some evidence", () => {
    for (const item of capabilityGroups.flatMap((g) => g.items)) {
      expect(item.projects.length > 0 || item.role === true, item.name).toBe(true);
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

  it("keeps 'production' to the professional role, and claims no agentic systems", () => {
    const aboutTheProjects = [
      ...strings(projects, "projects"),
      ...strings(capabilityGroups, "capabilities"),
      ...strings(principles, "principles"),
      ["profile.headline", profile.headline] as [string, string],
    ];
    for (const [at, text] of aboutTheProjects) {
      expect(text, at).not.toMatch(/(?<!non-)\bproduction\b/i);
      expect(text, at).not.toMatch(/\bagentic\b/i);
    }
  });

  it("never implies the Azure infrastructure was deployed", () => {
    for (const [at, text] of copy) {
      if (/azure/i.test(text)) expect(text, at).toMatch(/never applied|not applied|nothing has been applied|validate/i);
    }
  });

  it("never lists Terraform without saying it was not applied", () => {
    for (const item of capabilityGroups.flatMap((g) => g.items)) {
      if (/terraform/i.test(item.name)) expect(item.detail, item.name).toMatch(/not applied/i);
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

/**
 * The 404 page renders inside the root layout, so whatever metadata it does not set itself is the
 * home page's: the home page's title, and the layout's `index, follow`, which contradicts the
 * `noindex` Next.js adds to a 404 response.
 */
import { describe, expect, it } from "vitest";
import { metadata } from "@/app/not-found";
import { profile } from "@/data/profile";

/** The root layout's default title, which every page without a title of its own shows. */
const homeTitle = `${profile.name} — ${profile.role}`;

describe("the 404 page", () => {
  it("has a title of its own rather than the home page's", () => {
    // A plain string, so the layout's title template still applies; an absolute title skips it.
    expect(typeof metadata?.title).toBe("string");
    expect(metadata?.title).toBeTruthy();
    expect(metadata?.title).not.toBe(homeTitle);
  });

  it("is not marked for indexing", () => {
    expect(metadata?.robots).toMatchObject({ index: false });
  });
});

// One-off: copy screenshots from the project repositories into public/shots as cropped WebP.
//
// Every image here was captured by the project itself and committed under its own
// docs/screenshots directory. This script only crops and re-encodes them; it never edits the
// source files. Run from the repository root with the projects checked out beside it, optionally
// naming the shots to regenerate:
//
//   node scripts/prepare-shots.mjs ../projects [slug/name ...]
//
// The output is committed, so the site does not depend on this script or on the source checkouts.

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.argv[2];
if (!root) {
  console.error("usage: node scripts/prepare-shots.mjs <path-to-projects-directory>");
  process.exit(2);
}

const MAX_WIDTH = 1600;

/**
 * [slug, output name, source path inside the project, crop], where crop is null, a height kept
 * from the top, or { top, height } in source pixels.
 */
const MANIFEST = [
  ["ledger-exception-control-plane", "queue", "ledger-exception-control-plane/docs/screenshots/queue.png", null],
  ["ledger-exception-control-plane", "exception-detail", "ledger-exception-control-plane/docs/screenshots/exception-detail.png", 900],
  ["ledger-exception-control-plane", "fault-injection", "ledger-exception-control-plane/docs/screenshots/fault-injection.png", null],
  ["market-approach-desk", "board", "market-approach-desk/docs/screenshots/board.png", null],
  // The kill-test panel only. The screen's prose above it lists a "held by another broker" rule
  // that the project's claim transaction does not implement, so it is left out rather than shown.
  ["market-approach-desk", "comparison", "market-approach-desk/docs/screenshots/comparison.png", { top: 640, height: 760 }],
  ["callsite-impact", "result", "callsite-impact/docs/screenshots/result.png", 940],
  ["callsite-impact", "verdicts", "callsite-impact/docs/screenshots/verdicts.png", null],
  ["agent-authz-broker", "matrix", "agent-authz-broker/docs/screenshots/matrix.png", null],
  ["agent-authz-broker", "chain", "agent-authz-broker/docs/screenshots/chain.png", null],
  ["agent-authz-broker", "approvals", "agent-authz-broker/docs/screenshots/approvals.png", 760],
  ["counterparty-resolver", "pair", "counterparty-resolver/docs/screenshots/live/pair-light.png", 900],
  ["counterparty-resolver", "pair-dark", "counterparty-resolver/docs/screenshots/live/pair-dark.png", 900],
  ["counterparty-resolver", "queue", "counterparty-resolver/docs/screenshots/live/queue-light.png", null],
  ["counterparty-resolver", "queue-dark", "counterparty-resolver/docs/screenshots/live/queue-dark.png", null],
  ["bordereaux-reconciler", "overview", "bordereaux-reconciler/docs/screenshots/live/overview-light.png", 800],
  ["bordereaux-reconciler", "overview-dark", "bordereaux-reconciler/docs/screenshots/live/overview-dark.png", 800],
  ["bordereaux-reconciler", "row-lineage", "bordereaux-reconciler/docs/screenshots/live/row-lineage-light.png", null],
  ["bordereaux-reconciler", "row-lineage-dark", "bordereaux-reconciler/docs/screenshots/live/row-lineage-dark.png", null],
  ["bordereaux-reconciler", "evidence", "bordereaux-reconciler/docs/screenshots/live/evidence-light.png", 1380],
  ["bordereaux-reconciler", "evidence-dark", "bordereaux-reconciler/docs/screenshots/live/evidence-dark.png", 1380],
  ["parts-answer-gate", "answered", "parts-answer-gate/docs/screenshots/02-answered.png", 2150],
  ["parts-answer-gate", "refused", "parts-answer-gate/docs/screenshots/03-refused.png", 1800],
  ["parts-answer-gate", "knowledge-now", "parts-answer-gate/docs/screenshots/08-knowledge-now.png", 2250],
  ["parts-answer-gate", "knowledge-then", "parts-answer-gate/docs/screenshots/09-knowledge-then.png", 2250],
  ["parts-answer-gate", "failure-e", "parts-answer-gate/docs/screenshots/10-unsupported-answer-failure.png", 2250],
  ["parts-answer-gate", "evidence", "parts-answer-gate/docs/screenshots/04-evidence.png", 1800],
];

const only = new Set(process.argv.slice(3));

for (const [slug, name, source, crop] of MANIFEST) {
  if (only.size > 0 && !only.has(`${slug}/${name}`)) continue;
  const input = path.join(root, source);
  const image = sharp(input);
  const { width = 0, height = 0 } = await image.metadata();
  const box = typeof crop === "number" ? { top: 0, height: crop } : crop;
  const pipeline = box
    ? image.extract({ left: 0, top: box.top, width, height: Math.min(box.height, height - box.top) })
    : image;
  const directory = path.join("public", "shots", slug);
  await mkdir(directory, { recursive: true });
  const output = path.join(directory, `${name}.webp`);
  const info = await pipeline
    .resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(output);
  console.log(`${output}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

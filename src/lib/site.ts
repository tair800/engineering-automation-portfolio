/**
 * The canonical origin. Vercel exposes the production domain at build time; the fallback is the
 * same domain, so a local production build still emits correct canonical and Open Graph URLs.
 */
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = productionHost
  ? `https://${productionHost}`
  : "https://tahir-aslanli.vercel.app";

export const siteName = "Tahir Aslanli";

export const siteDescription =
  "Tahir Aslanli, AI Automation Engineer. Seven public engineering projects in AI automation, agent security, retrieval and reliable backend systems, each with its measured results and limitations.";

export const repositoryUrl = "https://github.com/tair800/engineering-automation-portfolio";

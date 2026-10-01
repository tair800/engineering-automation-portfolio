import { profile } from "@/data/profile";
import { repositoryUrl } from "@/lib/site";
import { ExternalLink } from "./external-link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-3 py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.name} · {profile.role}
        </p>
        {/* GitHub and LinkedIn are in the header on every page; the footer adds only the source. */}
        <p>
          <ExternalLink href={repositoryUrl} className="hover:text-ink">
            Source of this site
          </ExternalLink>
        </p>
      </div>
    </footer>
  );
}

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
        <p className="flex flex-wrap gap-x-5 gap-y-2">
          <ExternalLink href={profile.githubUrl} className="hover:text-ink">
            GitHub
          </ExternalLink>
          <ExternalLink href={profile.linkedinUrl} className="hover:text-ink">
            LinkedIn
          </ExternalLink>
          <ExternalLink href={repositoryUrl} className="hover:text-ink">
            Source of this site
          </ExternalLink>
        </p>
      </div>
    </footer>
  );
}

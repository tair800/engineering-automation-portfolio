import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col justify-center py-24">
      <p className="label">404</p>
      <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-ink">
        This page does not exist
      </h1>
      <p className="mt-3 max-w-[32rem] text-[15px] leading-[1.6] text-muted">
        The address may be mistyped, or the page may have moved. Every project is listed on the
        home page.
      </p>
      <Link
        href="/#projects"
        className="mt-8 inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-ink hover:opacity-80"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>
    </section>
  );
}

import Image from "next/image";
import type { Shot } from "@/data/types";

/**
 * A screenshot the project captured itself. Where it also captured a dark-mode version, the two
 * swap with the site theme. The provenance label says where the capture was taken.
 */
export function ShotFigure({
  shot,
  sizes = "(min-width: 1200px) 1136px, 100vw",
  preload = false,
}: {
  shot: Shot;
  sizes?: string;
  preload?: boolean;
}) {
  return (
    <figure className="flex flex-col">
      <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
        <Image
          src={shot.src}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          sizes={sizes}
          preload={preload}
          className={`shot-light h-auto w-full ${shot.darkSrc ? "has-dark" : ""}`}
        />
        {shot.darkSrc ? (
          <Image
            src={shot.darkSrc}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            sizes={sizes}
            className="shot-dark h-auto w-full"
          />
        ) : null}
      </div>
      <figcaption className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <span className="text-[13px] leading-5 text-ink-2">{shot.caption}</span>
        <span className="shrink-0 font-mono text-[10.5px] uppercase leading-5 tracking-[0.08em] text-muted">
          {shot.source === "live" ? "Captured from the live deployment" : "Screenshot from the project repository"}
        </span>
      </figcaption>
    </figure>
  );
}

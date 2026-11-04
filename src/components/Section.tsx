import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  number,
  className,
  children,
  emphasis = "default",
  tag,
  code,
}: {
  id: string;
  title: string;
  number: string;
  /** Replaces the REC-NN label for a record outside the numbered sequence. */
  code?: string;
  className?: string;
  children: React.ReactNode;
  emphasis?: "default" | "primary";
  tag?: string;
}) {
  return (
    <section
      id={id}
      data-sc-act="flow"
      className={cn("scroll-mt-20 px-5 py-3 sm:px-8 lg:px-10", className)}
    >
      <div className="mx-auto max-w-[1120px] rounded-[20px] border border-gray-200 bg-surface px-5 py-7 sm:px-8 sm:py-9">
        <div
          data-sc-reveal="up"
          data-sc-reveal-at="0 0.4"
          className={cn(
            "flex items-center gap-2.5 border-b pb-3",
            emphasis === "primary" ? "border-ink/15" : "border-border"
          )}
        >
          <span className="font-mono text-[11px] tabular-nums text-muted">
            {code ?? `REC-${number}`}
          </span>
          <h2
            className={cn(
              "font-display uppercase tracking-[0.06em]",
              emphasis === "primary" ? "text-lg font-semibold text-ink" : "text-base text-gray-600"
            )}
          >
            {title}
          </h2>
          {emphasis === "primary" && (
            <CheckCircle2 className="h-3.5 w-3.5 text-verified" aria-hidden="true" />
          )}
          {tag && (
            <span className="ml-auto rounded-full border border-gray-200 px-1.5 py-0.5 font-mono text-[9px] font-normal uppercase tracking-wide text-gray-400">
              {tag}
            </span>
          )}
        </div>
        <div data-sc-in className="mt-6 max-w-3xl">
          {children}
        </div>
      </div>
    </section>
  );
}

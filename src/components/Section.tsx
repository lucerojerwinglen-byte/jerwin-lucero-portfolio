import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  eyebrow,
  className,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10">
          {eyebrow && (
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  number,
  className,
  children,
}: {
  id: string;
  title: string;
  number: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-10 sm:py-12", className)}>
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="reveal font-pixel text-sm text-gray-500">
          {number} — {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

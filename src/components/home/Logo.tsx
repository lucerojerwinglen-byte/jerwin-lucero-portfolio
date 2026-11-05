// Server component: a brand logo (in its own colours) followed by its name. ADR 0006.
import { useId } from "react";
import { GENERIC, displayName, iconifySvg, prefixSvgIds, requireLogo, type LogoSpec } from "@/lib/logos";

/** Just the mark, decorative (the name is always written next to it, or spelled by a wordmark with its alt). */
export function LogoMark({ spec, label }: { spec: LogoSpec; label: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  if ("generic" in spec) {
    const Icon = GENERIC[spec.generic];
    return <Icon className="ico lg-mark lg-generic" aria-hidden="true" />;
  }
  if ("iconify" in spec) {
    const { body, viewBox } = iconifySvg(spec.iconify);
    return (
      <svg
        className={`lg-mark${spec.darkInvert ? " lg-invert" : ""}`}
        viewBox={viewBox}
        aria-hidden="true"
        // Trusted SVG from the installed @iconify-json/logos package, ids made unique per instance.
        dangerouslySetInnerHTML={{ __html: prefixSvgIds(body, `lg${uid}`) }}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG/PNG logos; next/image adds nothing here
    <img className={`lg-mark${spec.wordmark ? " lg-wordmark" : ""}`} src={spec.file} alt={spec.wordmark ? label : ""} />
  );
}

/**
 * Logo + name. A wordmark already spells the name, so it stands alone (ADR 0006); any
 * "(qualifier)" such as "(HRIS)" moves into the tooltip.
 */
export function Logo({ name, className = "" }: { name: string; className?: string }) {
  const spec = requireLogo(name);
  const label = displayName(name);
  const wordmark = "file" in spec && spec.wordmark;
  return (
    <span className={`lg ${className}`} title={label !== name ? name : undefined}>
      <LogoMark spec={spec} label={label} />
      {!wordmark && <span>{label}</span>}
    </span>
  );
}

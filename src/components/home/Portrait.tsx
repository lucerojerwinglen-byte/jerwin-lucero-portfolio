"use client";

import Image from "next/image";
import { useState } from "react";

export const PORTRAITS = { plain: "/images/jerwin-nocap.webp", cap: "/images/jerwin-cap.webp" } as const;

/**
 * The hero drawing with a cap you can put on and take off. Both drawings are aligned face to face
 * and cut out from their background (scripts/hero-cap-images.mjs), so the cap layer wipes in from
 * the top like a cap being pulled on, and lifts off the same way. Click the drawing or the chip.
 */
export function Portrait({ name }: { name: string }) {
  const [cap, setCap] = useState(false);
  const toggle = () => setCap((c) => !c);

  return (
    <div className="portrait" data-cap={cap} onClick={toggle}>
      <div className="portrait-art">
        <Image
          className="plain-layer"
          src={PORTRAITS.plain}
          alt={`Drawing of ${name}${cap ? " wearing a cap" : ""}`}
          width={440}
          height={440}
          sizes="(max-width: 900px) 340px, 220px"
          priority
        />
        <Image className="cap-layer" src={PORTRAITS.cap} alt="" aria-hidden="true" width={440} height={440} sizes="(max-width: 900px) 340px, 220px" />
      </div>
      <button
        type="button"
        className="cap-toggle"
        aria-pressed={cap}
        aria-label="Wear the cap"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <span aria-hidden="true">{cap ? "− cap" : "+ cap"}</span>
      </button>
    </div>
  );
}

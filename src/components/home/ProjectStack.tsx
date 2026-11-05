"use client";

import { Fragment, useState } from "react";
import { fanOffset } from "@/lib/home/fan";

export interface StackCard {
  key: string;
  label: string;
  /** Rendered on the server (logos stay server-side); this component only fans and switches. */
  content: React.ReactNode;
  placeholder?: boolean;
}

/** Cards fanned like a hand: the front one is readable, click a side card to bring it forward. 4+ cards: the rest wait out of sight. */
export function ProjectStack({ cards }: { cards: StackCard[] }) {
  const [front, setFront] = useState(0);

  return (
    <>
      <div className="stack-wrap" data-tour="projects">
        {cards.map((c, i) => {
          const offset = fanOffset(i, front, cards.length);
          const isFront = offset === 0;
          const isSide = offset === -1 || offset === 1;
          return (
            <Fragment key={c.key}>
              {/* Side cards are inert (their links can't be tabbed into), so this button, placed right
                  before its card, takes the click and keyboard focus and drives the card's hover style. */}
              {isSide && <button type="button" className="pcard-hit" data-pos={offset} aria-label={`Show ${c.label}`} onClick={() => setFront(i)} />}
              <div
                className={c.placeholder ? "pcard placeholder" : "pcard"}
                data-pos={offset ?? "hidden"}
                aria-hidden={offset === null || undefined}
                inert={!isFront || undefined}
                role={isFront ? "group" : undefined}
                aria-label={isFront ? c.label : undefined}
              >
                {c.content}
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="stack-dots" role="group" aria-label="Choose a project">
        {cards.map((c, i) => (
          <button key={c.key} type="button" aria-label={c.label} aria-current={i === front} onClick={() => setFront(i)} />
        ))}
      </div>
    </>
  );
}

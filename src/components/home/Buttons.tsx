"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { resetTour, safeLocalStorage } from "@/lib/home/tour";
import { openOverlay } from "./events";

export function CopyEmail({ email }: { email: string }) {
  return (
    <button
      type="button"
      className="hbtn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          toast.success("Email copied");
        } catch {
          toast.error("Couldn’t copy. Your browser blocked the clipboard.");
        }
      }}
    >
      <Copy className="ico" aria-hidden="true" />
      Copy
    </button>
  );
}

export function TourAgain() {
  return (
    <button
      type="button"
      onClick={() => {
        resetTour(safeLocalStorage());
        openOverlay("tour");
      }}
    >
      take the tour again
    </button>
  );
}

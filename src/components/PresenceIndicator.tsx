"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PresenceIndicator() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;

    let visitorId = sessionStorage.getItem("visitor-id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      sessionStorage.setItem("visitor-id", visitorId);
    }

    const channel = supabase.channel("portfolio-presence", {
      config: { presence: { key: visitorId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setCount(Object.keys(channel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: Date.now() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Missing env vars, connection failure, or still loading -> render nothing.
  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-gray-500">
      <Circle className="pulse-dot h-2 w-2 fill-emerald-500 text-emerald-500" />
      {count} {count === 1 ? "person" : "people"} viewing
    </span>
  );
}

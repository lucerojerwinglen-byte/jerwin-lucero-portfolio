"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Live count of people reading the page (Supabase Realtime presence). Null when unconfigured or offline. */
export function usePresence(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let visitorId: string;
    try {
      visitorId = sessionStorage.getItem("visitor-id") ?? crypto.randomUUID();
      sessionStorage.setItem("visitor-id", visitorId);
    } catch {
      visitorId = crypto.randomUUID();
    }
    const channel = supabase.channel("portfolio-presence", { config: { presence: { key: visitorId } } });
    channel
      .on("presence", { event: "sync" }, () => setCount(Object.keys(channel.presenceState()).length))
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ online_at: Date.now() });
      });
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return count;
}

"use client";

import Script from "next/script";
import { useCallback } from "react";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root?: Document | Element, opts?: Record<string, unknown>) => unknown };
  }
}

export function ScrollcraftMount() {
  const handleReady = useCallback(() => {
    window.ScrollCraft?.mount(document);
  }, []);

  return <Script src="/scrollcraft.js" strategy="afterInteractive" onReady={handleReady} />;
}

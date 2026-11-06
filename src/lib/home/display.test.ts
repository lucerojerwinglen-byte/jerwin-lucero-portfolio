import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_DISPLAY, displayAttributes, loadDisplay, saveDisplay } from "./display";

// Ticket #15 (ADR 0007): the Accessibility panel's settings, remembered per visitor.

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() { return m.size; },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

const throwing = {
  getItem() { throw new Error("SecurityError"); },
  setItem() { throw new Error("SecurityError"); },
} as unknown as Storage;

test("defaults: everything off", () => {
  assert.deepEqual(DEFAULT_DISPLAY, { largerText: false, reduceMotion: false, readableFont: false });
});

test("settings survive a reload", () => {
  const s = memoryStorage();
  saveDisplay(s, { largerText: true, reduceMotion: false, readableFont: true });
  assert.deepEqual(loadDisplay(s), { largerText: true, reduceMotion: false, readableFont: true });
});

test("blocked or missing storage falls back to defaults and never throws", () => {
  assert.deepEqual(loadDisplay(null), DEFAULT_DISPLAY);
  assert.deepEqual(loadDisplay(throwing), DEFAULT_DISPLAY);
  assert.doesNotThrow(() => saveDisplay(throwing, { ...DEFAULT_DISPLAY, largerText: true }));
  assert.doesNotThrow(() => saveDisplay(null, DEFAULT_DISPLAY));
});

test("garbage in storage is ignored", () => {
  const s = memoryStorage();
  s.setItem("home-display", "{not json");
  assert.deepEqual(loadDisplay(s), DEFAULT_DISPLAY);
  s.setItem("home-display", JSON.stringify({ largerText: "yes", reduceMotion: true }));
  assert.deepEqual(loadDisplay(s), { largerText: false, reduceMotion: true, readableFont: false });
});

test("each setting maps to one attribute on <html>; off removes it", () => {
  assert.deepEqual(displayAttributes(DEFAULT_DISPLAY), { "data-text": null, "data-motion": null, "data-font": null });
  assert.deepEqual(displayAttributes({ largerText: true, reduceMotion: true, readableFont: true }), {
    "data-text": "large",
    "data-motion": "reduce",
    "data-font": "readable",
  });
});

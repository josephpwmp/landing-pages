"use client";

import { useEffect } from "react";

/**
 * Runs pasted third-party snippets (e.g. WhatConverts) after mount.
 * Only use with trusted input — the generator is an internal tool.
 */
export function WhatConvertsInjector({ html }: { html: string }) {
  useEffect(() => {
    const trimmed = html.trim();
    if (!trimmed) return;

    const container = document.createElement("div");
    container.innerHTML = trimmed;
    const scripts = container.querySelectorAll("script");

    scripts.forEach((old) => {
      const s = document.createElement("script");
      for (const attr of Array.from(old.attributes)) {
        s.setAttribute(attr.name, attr.value);
      }
      s.textContent = old.textContent;
      document.body.appendChild(s);
    });
  }, [html]);

  return null;
}

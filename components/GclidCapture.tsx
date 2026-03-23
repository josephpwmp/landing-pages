"use client";

import { useEffect } from "react";

export function GclidCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get("gclid");
    const field = document.querySelector<HTMLInputElement>('input[name="gclid"]');
    if (gclid && field) field.value = gclid;
  }, []);

  return null;
}

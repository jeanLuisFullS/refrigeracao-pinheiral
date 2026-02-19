"use client";

import { useEffect } from "react";

export default function ErrorReporter() {
  useEffect(() => {
    const report = (e: ErrorEvent) => {
      fetch("/api/admin/report-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: e.message,
          stack: e.error?.stack,
          url: window.location.href,
        }),
      }).catch(() => {});
    };
    window.addEventListener("error", report);
    return () => window.removeEventListener("error", report);
  }, []);
  return null;
}

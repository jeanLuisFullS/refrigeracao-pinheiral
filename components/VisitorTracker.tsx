"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const path = pathname || "/";
    // Não registrar visita ao navegar dentro do painel admin
    if (path.startsWith("/admin")) return;
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  }, [pathname]);
  return null;
}
